import fs from 'fs';
import path from 'path';

/**
 * 名称のゆらぎを吸収して比較用に正規化する
 */
function normalizeName(s) {
  if (!s) return '';
  return s
    .replace(/[　\s]+/g, '')
    .replace(/スキー場|スノーリゾート|スノボ|スキー＆スノーボード|スノーパーク|ウインタースポーツパーク|リゾート|ゲレンデ|温泉|町営|村営|市営|高原|山|信州|白山|河内|金沢|東急|星野|みやぎ|会津/g, '')
    .replace(/[・\-－―〜～()（）「」『』’'★!！\.]/g, '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/ヶ/g, 'ガ')
    .replace(/バレイ/g, 'バレー')
    .replace(/水上/g, 'みなかみ')
    .replace(/御坂/g, 'みさか')
    .replace(/神室/g, 'カムロ')
    .replace(/１９１/g, '191')
    .toLowerCase();
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchWnElevation(spotid) {
  const url = `https://weathernews.jp/ski/spot/${spotid}/`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/<dt class="spotInfoList__title">標高<\/dt>\s*<dd class="spotInfoList__content">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (!m) return { raw: null, top: null, base: null };
  const raw = m[1].replace(/\s+/g, ' ').trim();
  const nums = [...raw.matchAll(/(\d{2,4})\s*m/gi)].map(x => parseInt(x[1], 10));
  if (nums.length >= 2) {
    return { raw, top: Math.max(...nums), base: Math.min(...nums) };
  } else if (nums.length === 1) {
    return { raw, top: nums[0], base: null };
  }
  return { raw, top: null, base: null };
}

// 名称が異なるが同一スキー場であることが確実な手動マッピング (wn.spotid -> spot_rules.id)
const MANUAL_WN_MAP = {
  '34202': 'tenjindaira', // Mt.T by 星野リゾート <-> 谷川岳天神平
  '34859': 'hakuba47',    // Hakuba47ウインタースポーツパーク
  '35510': 'ski_ski551',  // IOX-AROSA (イオックス・アローザ)
  '35447': 'muikamachi',  // ムイカスノーリゾート (六日町)
  '33103': 'ski_ski173',  // 青森スプリング・スキーリゾート (旧ナクア白神)
  '34854': 'ski_ski510',  // 信州開田高原マイアスキー場
};

// 新規追加対象（営業実態確認済み）
const NEW_ADDITIONS = [
  {
    wnSpotId: '36313', // 峰山高原リゾート WHITE PEAK
    id: 'mineyama_kogen',
    name: '峰山高原リゾート WHITE PEAK',
    areaName: '兵庫北部・神河',
    baseLabel: 'センターハウス山麓',
    topLabel: '山頂ゲレンデ',
  },
  {
    wnSpotId: '38301', // くじゅうスキー場（九重森林公園スキー場）
    id: 'kujyu_shinrin',
    name: '九重森林公園スキー場',
    areaName: '大分・九重',
    baseLabel: 'センターハウス山麓',
    topLabel: 'パノラマゲレンデ山頂',
  },
  {
    wnSpotId: '31703', // ノーザンアークリゾートスキー場（2024年12月営業再開）
    id: 'northern_arc',
    name: 'ノーザンアークリゾートスキー場',
    areaName: '道東・オホーツク',
    baseLabel: 'ロッジ山麓',
    topLabel: 'ゲレンデ山頂',
  }
];

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const rulesPath = path.join(process.cwd(), 'spot_rules_japan.json');
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
  const skiSpots = rules.filter(s => s.category === 'ski');
  const invPath = path.join(process.cwd(), 'scripts', 'ski_resorts_investigation_results.json');
  const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
  const invMap = new Map(inv.map(r => [r.id, r]));

  const res = await fetch('https://site.weathernews.jp/site/ski/json/searchdata.json', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const wnList = await res.json();
  const wnById = new Map(wnList.map(w => [String(w.spotid), w]));

  // 1. 突合 (spot_rules.id -> best wn)
  const matchedBySpId = new Map();
  for (const wn of wnList) {
    const manualId = MANUAL_WN_MAP[String(wn.spotid)];
    if (manualId) {
      const sp = skiSpots.find(s => s.id === manualId);
      if (sp) {
        const wnLat = parseFloat(wn.lat);
        const wnLon = parseFloat(wn.lon);
        const dist = (wnLat && wnLon && sp.base?.lat && sp.base?.lon)
          ? haversineKm(wnLat, wnLon, sp.base.lat, sp.base.lon)
          : 0;
        matchedBySpId.set(sp.id, { wn, sp, dist, score: 999 });
        continue;
      }
    }

    const wnLat = parseFloat(wn.lat);
    const wnLon = parseFloat(wn.lon);
    const wnNorm = normalizeName(wn.pointname);

    let best = null;
    let bestScore = -1;

    for (const sp of skiSpots) {
      const samePref = sp.prefecture === wn.pointpref;
      const spNorm = normalizeName(sp.name);
      const dist = (wnLat && wnLon && sp.base?.lat && sp.base?.lon)
        ? haversineKm(wnLat, wnLon, sp.base.lat, sp.base.lon)
        : 9999;

      let score = 0;
      if (wnNorm && spNorm) {
        if (wnNorm === spNorm) score += 120;
        else if (wnNorm.includes(spNorm) || spNorm.includes(wnNorm)) score += 70;
      }
      if (samePref) score += 20;
      if (dist < 2) score += 90;
      else if (dist < 5) score += 60;
      else if (dist < 10) score += 30;

      if (score >= 90 && (dist < 20 || wnNorm === spNorm)) {
        if (score > bestScore) {
          bestScore = score;
          best = { sp, dist, score };
        }
      }
    }

    if (best) {
      if (!matchedBySpId.has(best.sp.id) || matchedBySpId.get(best.sp.id).score < best.score) {
        matchedBySpId.set(best.sp.id, { wn, sp: best.sp, dist: best.dist, score: best.score });
      }
    }
  }

  console.log(`突合完了: ${matchedBySpId.size} / ${skiSpots.length} スキー場が Weathernews と一致`);

  // 2. 補完対象の抽出:
  //    - SURF&SNOW 標高欠損 124件
  //    - SURF&SNOW 座標欠損 59件
  //    - 既存標高差 < 50m
  const targets = [...matchedBySpId.values()].filter(({ sp }) => {
    const ref = invMap.get(sp.id)?.referenceData;
    const missElev = !ref || ref.topElevation == null || ref.baseElevation == null;
    const missCoord = !ref || ref.lat == null || ref.lon == null;
    const smallDiff = (sp.top?.elevation - sp.base?.elevation) < 50;
    return missElev || missCoord || smallDiff;
  });

  console.log(`補完対象スポット（WN一致分）: ${targets.length} 件`);

  // バッチでWNスポットページから標高を取得
  const batchSize = 10;
  const fetchedMap = new Map();
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    const resList = await Promise.all(batch.map(async t => {
      const elev = await fetchWnElevation(t.wn.spotid);
      return { id: t.sp.id, elev };
    }));
    resList.forEach(r => fetchedMap.set(r.id, r.elev));
  }

  let elevUpdated = 0;
  let coordUpdated = 0;
  const elevSamples = [];

  for (const { wn, sp } of targets) {
    const ref = invMap.get(sp.id)?.referenceData;
    const missElev = !ref || ref.topElevation == null || ref.baseElevation == null;
    const missCoord = !ref || ref.lat == null || ref.lon == null;
    const smallDiff = (sp.top?.elevation - sp.base?.elevation) < 50;

    // 標高補完
    const wnElev = fetchedMap.get(sp.id);
    if ((missElev || smallDiff) && wnElev && wnElev.top != null && wnElev.base != null && wnElev.top > wnElev.base) {
      if (sp.top.elevation !== wnElev.top || sp.base.elevation !== wnElev.base) {
        elevSamples.push(`${sp.id}(${sp.name}): ${sp.top.elevation}/${sp.base.elevation} -> ${wnElev.top}/${wnElev.base}`);
        if (!dryRun) {
          sp.top.elevation = wnElev.top;
          sp.base.elevation = wnElev.base;
        }
        elevUpdated++;
      }
    }

    // 座標補完（SURF&SNOWで座標が取れなかったスポットのみ、WN代表座標をbaseに反映）
    const wnLat = parseFloat(wn.lat);
    const wnLon = parseFloat(wn.lon);
    if (missCoord && Number.isFinite(wnLat) && Number.isFinite(wnLon)) {
      if (Math.abs(sp.base.lat - wnLat) > 0.0005 || Math.abs(sp.base.lon - wnLon) > 0.0005) {
        if (!dryRun) {
          const dLat = wnLat - sp.base.lat;
          const dLon = wnLon - sp.base.lon;
          sp.base.lat = Number(wnLat.toFixed(6));
          sp.base.lon = Number(wnLon.toFixed(6));
          // topがbaseとほぼ同じか遠すぎる場合は平行移動して整合維持
          sp.top.lat = Number((sp.top.lat + dLat).toFixed(6));
          sp.top.lon = Number((sp.top.lon + dLon).toFixed(6));
        }
        coordUpdated++;
      }
    }
  }

  // 3. 新規営業中スポットの追加
  let addedCount = 0;
  const addedList = [];
  for (const cfg of NEW_ADDITIONS) {
    if (rules.some(s => s.id === cfg.id)) continue;
    const wn = wnById.get(cfg.wnSpotId);
    if (!wn) continue;
    const wnLat = parseFloat(wn.lat);
    const wnLon = parseFloat(wn.lon);
    const wnElev = await fetchWnElevation(cfg.wnSpotId);
    if (!wnElev || wnElev.top == null || wnElev.base == null) continue;

    // 同一都道府県または最寄り既存スキー場から region / regionName / amedas を引き継ぐ
    let nearest = null;
    let minDist = Infinity;
    for (const sp of skiSpots) {
      const d = haversineKm(wnLat, wnLon, sp.base.lat, sp.base.lon);
      if (d < minDist) {
        minDist = d;
        nearest = sp;
      }
    }

    const newSpot = {
      id: cfg.id,
      name: cfg.name,
      category: 'ski',
      region: nearest.region,
      regionName: nearest.regionName,
      prefecture: wn.pointpref,
      areaName: cfg.areaName,
      base: {
        lat: Number(wnLat.toFixed(6)),
        lon: Number(wnLon.toFixed(6)),
        elevation: wnElev.base,
        label: cfg.baseLabel,
      },
      top: {
        lat: Number((wnLat + 0.005).toFixed(6)),
        lon: Number((wnLon + 0.005).toFixed(6)),
        elevation: wnElev.top,
        label: cfg.topLabel,
      },
      amedasId: nearest.amedasId,
      amedasName: nearest.amedasName,
      slopeOrientation: nearest.slopeOrientation || 'N',
    };

    addedList.push(`${newSpot.id} (${newSpot.name}, ${newSpot.prefecture}, ${newSpot.top.elevation}/${newSpot.base.elevation}m, amedas=${newSpot.amedasName})`);
    if (!dryRun) {
      rules.push(newSpot);
    }
    addedCount++;
  }

  console.log(`\n標高更新: ${elevUpdated} 件`);
  console.log(`座標補完: ${coordUpdated} 件`);
  console.log(`新規追加: ${addedCount} 件`);
  console.log('\n標高更新サンプル (最大15件):');
  elevSamples.slice(0, 15).forEach(s => console.log('  ' + s));
  console.log('\n新規追加一覧:');
  addedList.forEach(s => console.log('  ' + s));

  if (!dryRun) {
    fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2) + '\n', 'utf8');
    console.log('\nspot_rules_japan.json を保存しました。');
  } else {
    console.log('\n[--dry-run] ファイルは変更していません。');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
