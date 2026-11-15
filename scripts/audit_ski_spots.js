const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function distKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 国土地理院 標高API (DEM) から標高(m)を取得
async function getGsiElevation(lat, lon) {
  try {
    const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data.elevation === 'number' && data.elevation > -999) {
      return Math.round(data.elevation);
    }
  } catch (e) {}
  return null;
}

async function run() {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit='));
  const regionArg = args.find(a => a.startsWith('--region='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 9999;
  const region = regionArg ? regionArg.split('=')[1] : '';

  const rulesPath = path.join(__dirname, '..', 'spot_rules_japan.json');
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
  const targets = rules
    .filter(s => s.category === 'ski' && (!region || s.region === region))
    .slice(0, limit);

  console.log(`=== 全国スキー場 国土地理院標高＆静的整合性監査開始 (count=${targets.length}) ===`);

  // 重複名チェック用マップ
  const nameCounts = {};
  targets.forEach(s => { nameCounts[s.name] = (nameCounts[s.name] || 0) + 1; });

  const results = [];
  const summary = {
    total: targets.length,
    placeholder1100_600: 0,
    reversedElev: 0,
    gsiReversed: 0,
    duplicateName: 0,
    lowDiff: 0
  };

  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    if (i % 25 === 0) {
      console.log(`進捗: ${i} / ${targets.length}`);
    }

    const [topGsiElev, baseGsiElev] = await Promise.all([
      getGsiElevation(s.top.lat, s.top.lon),
      getGsiElevation(s.base.lat, s.base.lon)
    ]);

    const issues = [];
    const isPlaceholder = s.top.elevation === 1100 && s.base.elevation === 600;
    if (isPlaceholder) {
      issues.push('仮置き標高(1100/600)');
      summary.placeholder1100_600++;
    }
    if (s.top.elevation <= s.base.elevation) {
      issues.push('設定標高逆転');
      summary.reversedElev++;
    }
    if (topGsiElev !== null && baseGsiElev !== null) {
      if (topGsiElev <= baseGsiElev) {
        issues.push('地理院実標高逆転(座標逆/ズレ)');
        summary.gsiReversed++;
      } else if (topGsiElev - baseGsiElev < 50) {
        issues.push(`標高差50m未満(${topGsiElev - baseGsiElev}m)`);
        summary.lowDiff++;
      }
    }
    if (nameCounts[s.name] > 1) {
      issues.push('同名重複');
      summary.duplicateName++;
    }

    results.push({
      id: s.id,
      name: s.name,
      region: s.region,
      regionName: s.regionName,
      prefecture: s.prefecture,
      areaName: s.areaName,
      issues,
      current: {
        top: s.top,
        base: s.base,
        topGsiElev,
        baseGsiElev,
        gsiElevDiff: (topGsiElev !== null && baseGsiElev !== null) ? (topGsiElev - baseGsiElev) : null,
        topBaseDistKm: Math.round(distKm(s.top.lat, s.top.lon, s.base.lat, s.base.lon) * 100) / 100
      }
    });

    await sleep(80);
  }

  const outPath = path.join(__dirname, 'ski_audit_all.json');
  fs.writeFileSync(outPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    summary,
    results
  }, null, 2));

  console.log('\n=== 全国スキー場 監査完了 ===');
  console.log(summary);
  console.log(`出力ファイル: ${outPath}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
