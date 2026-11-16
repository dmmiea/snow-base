const fs = require('fs');
const path = require('path');

const RULES_PATH = path.join(__dirname, '..', 'spot_rules_japan.json');
const AUDIT_PATH = path.join(__dirname, 'ski_audit_all.json');

const rules = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));

// 監査結果をIDでマップ化
const auditMap = new Map();
for (const r of audit.results) {
  auditMap.set(r.id, r);
}

// 1. 重複IDの削除
const DUPLICATE_IDS = new Set([
  'ski_ski544', // ダイナランド (dynalandと重複)
  'ski_ski543', // 高鷲スノーパーク (takasuと重複)
  'ski_ski583', // スキージャム勝山 (skijam_katsuyamaと重複)
  'ski_ski660'  // だいせんホワイトリゾート (daisen_whiteと重複)
]);

// すでに手動精査・修正済みのIDはスキップ（座標・標高が確定済み）
const ALREADY_FIXED = new Set(['rusutsu', 'geto']);

let removedCount = 0;
let swappedCount = 0;
let elevUpdatedCount = 0;

const updatedRules = [];
for (const spot of rules) {
  if (DUPLICATE_IDS.has(spot.id)) {
    removedCount++;
    continue;
  }

  if (spot.category === 'ski' && !ALREADY_FIXED.has(spot.id)) {
    const a = auditMap.get(spot.id);
    if (a && a.current && typeof a.current.topGsiElev === 'number' && typeof a.current.baseGsiElev === 'number') {
      const topGsi = a.current.topGsiElev;
      const baseGsi = a.current.baseGsiElev;

      if (topGsi < baseGsi) {
        // topとbaseの座標が逆転しているためスワップ
        const origTopLat = spot.top.lat;
        const origTopLon = spot.top.lon;
        spot.top.lat = spot.base.lat;
        spot.top.lon = spot.base.lon;
        spot.base.lat = origTopLat;
        spot.base.lon = origTopLon;

        spot.top.elevation = baseGsi;
        spot.base.elevation = topGsi;
        swappedCount++;
        elevUpdatedCount++;
      } else {
        if (spot.top.elevation !== topGsi || spot.base.elevation !== baseGsi) {
          spot.top.elevation = topGsi;
          spot.base.elevation = baseGsi;
          elevUpdatedCount++;
        }
      }
    }
  }

  updatedRules.push(spot);
}

fs.writeFileSync(RULES_PATH, JSON.stringify(updatedRules, null, 2) + '\n', 'utf8');

console.log(`完了:`);
console.log(`- 重複削除: ${removedCount}件`);
console.log(`- 座標スワップ(逆転修正): ${swappedCount}件`);
console.log(`- GSI実標高への更新: ${elevUpdatedCount}件`);
console.log(`- 更新後の総スポット数: ${updatedRules.length}件 (うちski: ${updatedRules.filter(s => s.category === 'ski').length}件)`);
