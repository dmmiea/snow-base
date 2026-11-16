import fs from 'fs';
import path from 'path';
import { BC_MASTER_SPOTS } from './bc_master_data.js';

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchGsiElevation(lat, lon) {
  const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (typeof data.elevation === 'number') {
        return Math.round(data.elevation);
      }
    } catch (_) {
      // リトライ
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return null;
}

async function fetchActiveAmedasStations() {
  const tableRes = await fetch('https://www.jma.go.jp/bosai/amedas/const/amedastable.json');
  const table = await tableRes.json();

  const timeRes = await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt');
  const timeText = (await timeRes.text()).trim();
  const timeStr = timeText.replace(/[-:T\+]/g, '').slice(0, 14);
  const mapRes = await fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${timeStr}.json`);
  const activeMap = await mapRes.json();

  const stations = [];
  for (const [id, info] of Object.entries(table)) {
    if (!activeMap[id]) continue;
    const lat = info.lat[0] + info.lat[1] / 60;
    const lon = info.lon[0] + info.lon[1] / 60;
    stations.push({ id, name: info.kjName, lat, lon });
  }
  return stations;
}

function findNearestAmedas(lat, lon, stations) {
  let best = null;
  let bestDist = Infinity;
  for (const st of stations) {
    const d = haversineKm(lat, lon, st.lat, st.lon);
    if (d < bestDist) {
      bestDist = d;
      best = st;
    }
  }
  return { station: best, distKm: bestDist };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`BCスポット再構築開始 (対象: ${BC_MASTER_SPOTS.length}座, dryRun=${dryRun})`);

  // 1. 気象庁アメダス観測所一覧取得
  const stations = await fetchActiveAmedasStations();
  console.log(`稼働中アメダス観測所: ${stations.length}件取得`);

  // 2. 国土地理院 標高APIで全150座の Top/Base 実標高を検証・確定
  const topAnomalies = [];
  const baseAnomalies = [];
  const rebuiltBc = [];

  // 5件ずつバッチ処理してAPI負荷を抑える
  const batchSize = 5;
  for (let i = 0; i < BC_MASTER_SPOTS.length; i += batchSize) {
    const batch = BC_MASTER_SPOTS.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (spot) => {
      const [gsiTopElev, gsiBaseElev] = await Promise.all([
        fetchGsiElevation(spot.top.lat, spot.top.lon),
        fetchGsiElevation(spot.base.lat, spot.base.lon)
      ]);

      const topDiff = gsiTopElev !== null ? (gsiTopElev - spot.top.elevation) : null;
      if (topDiff !== null && Math.abs(topDiff) > 80) {
        topAnomalies.push({
          id: spot.id,
          name: spot.name,
          expectedTop: spot.top.elevation,
          gsiTop: gsiTopElev,
          diff: topDiff,
          lat: spot.top.lat,
          lon: spot.top.lon
        });
      }

      const finalBaseElev = gsiBaseElev !== null ? gsiBaseElev : spot.base.elevation;
      const distKm = haversineKm(spot.top.lat, spot.top.lon, spot.base.lat, spot.base.lon);
      const drop = spot.top.elevation - finalBaseElev;

      if (drop < 100 || distKm > 10 || distKm < 0.2) {
        baseAnomalies.push({
          id: spot.id,
          name: spot.name,
          topElev: spot.top.elevation,
          baseElev: finalBaseElev,
          drop,
          distKm: Number(distKm.toFixed(2))
        });
      }

      const { station } = findNearestAmedas(spot.base.lat, spot.base.lon, stations);

      return {
        id: spot.id,
        name: spot.name,
        category: 'bc',
        region: spot.region,
        regionName: spot.regionName,
        prefecture: spot.prefecture,
        areaName: spot.areaName,
        base: {
          lat: spot.base.lat,
          lon: spot.base.lon,
          elevation: finalBaseElev,
          label: spot.base.label
        },
        top: {
          lat: spot.top.lat,
          lon: spot.top.lon,
          elevation: spot.top.elevation,
          label: spot.top.label
        },
        amedasId: station.id,
        amedasName: station.name,
        slopeOrientation: spot.slopeOrientation
      };
    }));

    rebuiltBc.push(...results);
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n--- GSI Top標高チェック (誤差 > 80m): ${topAnomalies.length}件 ---`);
  if (topAnomalies.length > 0) console.table(topAnomalies);

  console.log(`\n--- Base/距離/標高差チェック (drop < 100m or dist > 10km): ${baseAnomalies.length}件 ---`);
  if (baseAnomalies.length > 0) console.table(baseAnomalies);

  if (dryRun) {
    console.log('\n[dry-run] ファイル更新はスキップしました。');
    return;
  }

  // 3. spot_rules_japan.json の読み込み・スキー場保持・BC差し替え
  const rulesPath = path.join(process.cwd(), 'spot_rules_japan.json');
  const existing = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
  const skiOnly = existing.filter(s => s.category === 'ski');

  const merged = [...skiOnly, ...rebuiltBc];
  fs.writeFileSync(rulesPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`\n保存完了: Ski=${skiOnly.length}件, BC=${rebuiltBc.length}件, 合計=${merged.length}件`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
