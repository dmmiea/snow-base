const fs = require('fs');
const path = require('path');

// クロールした1352件の生データ
const rawData = JSON.parse(fs.readFileSync('crawled_all_japan.json', 'utf8'));

// 地域マッピング関数
function determineRegion(areaName) {
  if (!areaName) return { region: 'shinetsu', regionName: '信越' };
  
  if (areaName.includes('北海道') || areaName.includes('道北') || areaName.includes('道東') || areaName.includes('道央') || areaName.includes('道南') || areaName.includes('後志') || areaName.includes('上川') || areaName.includes('空知') || areaName.includes('石狩') || areaName.includes('宗谷') || areaName.includes('オホーツク') || areaName.includes('胆振') || areaName.includes('日高') || areaName.includes('十勝') || areaName.includes('釧路') || areaName.includes('根室')) {
    return { region: 'hokkaido', regionName: '北海道' };
  }
  if (areaName.includes('青森') || areaName.includes('岩手') || areaName.includes('秋田') || areaName.includes('宮城') || areaName.includes('山形') || areaName.includes('福島')) {
    return { region: 'tohoku', regionName: '東北' };
  }
  if (areaName.includes('新潟') || areaName.includes('長野')) {
    return { region: 'shinetsu', regionName: '信越' };
  }
  if (areaName.includes('富山') || areaName.includes('石川') || areaName.includes('福井')) {
    return { region: 'hokuriku', regionName: '北陸' };
  }
  if (areaName.includes('群馬') || areaName.includes('栃木') || areaName.includes('茨城') || areaName.includes('埼玉') || areaName.includes('東京') || areaName.includes('神奈川') || areaName.includes('千葉')) {
    return { region: 'kanto', regionName: '関東' };
  }
  if (areaName.includes('岐阜') || areaName.includes('静岡') || areaName.includes('愛知') || areaName.includes('山梨')) {
    return { region: 'tokai', regionName: '東海・甲信' };
  }
  if (areaName.includes('滋賀') || areaName.includes('京都') || areaName.includes('兵庫') || areaName.includes('大阪') || areaName.includes('奈良') || areaName.includes('和歌山')) {
    return { region: 'kansai', regionName: '関西' };
  }
  if (areaName.includes('鳥取') || areaName.includes('島根') || areaName.includes('岡山') || areaName.includes('広島') || areaName.includes('山口')) {
    return { region: 'chugoku', regionName: '中国' };
  }
  if (areaName.includes('徳島') || areaName.includes('香川') || areaName.includes('愛媛') || areaName.includes('高知') || areaName.includes('福岡') || areaName.includes('佐賀') || areaName.includes('長崎') || areaName.includes('熊本') || areaName.includes('大分') || areaName.includes('宮崎') || areaName.includes('鹿児島')) {
    return { region: 'shikoku_kyushu', regionName: '四国・九州' };
  }

  return { region: 'shinetsu', regionName: '信越' };
}

const cleanedSpots = [];
const seenIds = new Set();

for (const item of rawData) {
  if (!item.lat || !item.lon || !item.name) continue;

  const id = item.id;
  if (seenIds.has(id)) continue;
  seenIds.add(id);

  const regionInfo = determineRegion(item.areaName);

  // 標高の推計（山岳とスキー場の平均的標高）
  const isBc = item.category === 'bc';
  const baseElev = isBc ? 800 : 600;
  const topElev = isBc ? 1500 : 1200;

  cleanedSpots.push({
    id,
    name: item.name,
    category: item.category,
    region: regionInfo.region,
    regionName: regionInfo.regionName,
    areaName: item.areaName || regionInfo.regionName,
    lat: item.lat,
    lon: item.lon,
    topElev,
    baseElev,
    amedasId: item.amedasId || null,
    amedasName: item.amedasName || null,
    slopeOrientation: 'N'
  });
}

const outputPath = path.join(__dirname, '..', 'spot_rules_japan.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedSpots, null, 2), 'utf8');

const skiCount = cleanedSpots.filter(s => s.category === 'ski').length;
const bcCount = cleanedSpots.filter(s => s.category === 'bc').length;
console.log(`=== spot_rules_japan.json を再構築完了！ ===`);
console.log(`スキー場: ${skiCount} 件`);
console.log(`バックカントリー山岳: ${bcCount} 件`);
console.log(`合計: ${cleanedSpots.length} 件`);
