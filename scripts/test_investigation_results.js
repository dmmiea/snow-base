const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, '..', 'spot_rules_japan.json');
const resultsPath = path.join(__dirname, 'ski_resorts_investigation_results.json');
const reportPath = path.join(__dirname, '..', 'SKI_RESORTS_INVESTIGATION_REPORT.md');

const allRules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const skiSpots = allRules.filter(s => s.category === 'ski');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const reportMd = fs.readFileSync(reportPath, 'utf8');

console.log('=== RUNNING VERIFICATION SUITE ===');

// Test 1: Total count coverage
if (skiSpots.length !== 495) throw new Error(`Expected 495 ski spots, got ${skiSpots.length}`);
if (results.length !== 495) throw new Error(`Expected 495 result records, got ${results.length}`);
console.log('✓ Test 1 Passed: 495 spots covered exactly');

// Test 2: Spot ID bijection
const ruleIds = new Set(skiSpots.map(s => s.id));
const resIds = new Set(results.map(r => r.id));
for (const id of ruleIds) {
  if (!resIds.has(id)) throw new Error(`Missing spot id in results: ${id}`);
}
for (const id of resIds) {
  if (!ruleIds.has(id)) throw new Error(`Extra spot id in results: ${id}`);
}
console.log('✓ Test 2 Passed: 1-to-1 spot ID match between rules and results');

// Test 3: Status distribution
const operating = results.filter(r => r.status === '営業中');
const closed = results.filter(r => r.status === '休止・廃業');
const unconfirmed = results.filter(r => r.status === '要確認（名称不一致・未掲載）');

if (operating.length !== 435) throw new Error(`Expected 435 operating spots, got ${operating.length}`);
if (closed.length !== 60) throw new Error(`Expected 60 closed spots, got ${closed.length}`);
if (unconfirmed.length !== 0) throw new Error(`Expected 0 unconfirmed spots, got ${unconfirmed.length}`);
console.log(`✓ Test 3 Passed: 営業中: ${operating.length}, 休止・廃業: ${closed.length}, 要確認: ${unconfirmed.length}`);

// Test 4: Verify key previously misclassified closed spots are now closed
const knownClosedIds = [
  'ski_ski321', // 武尊牧場
  'ski_ski267', // 栗子国際
  'ski_ski284', // 横向温泉
  'ski_ski397', // マウンテンパーク津南
  'ski_ski334', // 赤城山第三
  'ski_ski480', // 白馬みねかた
  'ski_ski497', // エコーバレー
  'ski_ski547', // イトシロシャーロットタウン
  'ski_ski616', // ミタカスノーパーク
  'ski_ski67',  // 三井グリーンランドホワイトパーク
  'ski_ski150', // 船見台
  'ski_ski69',  // 栗山町
  'ski_ski200', // 鳥海オコジョランド
  'ski_ski231', // 眺海の森平田
  'ski_ski502', // 乗鞍高原いがや
  'ski_ski515', // あららぎ高原
  'ski_ski275', // St MARY
  'ski_ski152', // 北湯沢温泉
  'ski_ski629', // 津黒高原
  'ski_ski540', // 荘川高原
  'ski_ski553', // 母袋温泉
  'ski_ski651', // ホワイトバレー松原
  'ski_ski679', // 天狗高原
  'ski_ski195', // 湯沢（角間沢）
  'ski_ski192', // 山内
  'ski_ski222', // 北上市民和賀
  'ski_ski234', // 八幡
  'ski_ski245', // あつみ温泉一本木
  'ski_ski459', // 斑尾高原サンパティック (2023年破産閉鎖)
  'ski_ski461', // 斑尾高原豊田 (2012年休止・敷地譲渡)
  'ski_ski663'  // 休暇村奥大山 / 奥大山スキー場 (2019年休業閉鎖)
];

for (const id of knownClosedIds) {
  const item = results.find(r => r.id === id);
  if (!item || item.status !== '休止・廃業') {
    throw new Error(`Spot ${id} (${item ? item.name : 'null'}) was expected to be '休止・廃業', but got '${item ? item.status : 'null'}'`);
  }
}
console.log(`✓ Test 4 Passed: All ${knownClosedIds.length} critically audited closed spots confirmed '休止・廃業'`);

// Test 5: Verify operating spots have proper metadata / no cross-prefecture distance explosions
function distKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

for (const r of operating) {
  if (r.referenceData && r.referenceData.lat && r.referenceData.lon) {
    const d = distKm(r.currentCoords.base.lat, r.currentCoords.base.lon, r.referenceData.lat, r.referenceData.lon);
    if (d > 100) {
      throw new Error(`Anomalous distance d=${d}km for ${r.id} (${r.name}) -> ${r.evidence.matchedName}`);
    }
  }
}
console.log('✓ Test 5 Passed: No geographic distance anomalies (>100km) in operating spots');

// Test 6: Report markdown contains required tables and statistics
if (!reportMd.includes('435件') || !reportMd.includes('60件')) {
  throw new Error('Report markdown does not contain expected summary counts');
}
if (!reportMd.includes('次期フェーズ（標高・位置情報精査）に向けた重要取得項目メモ')) {
  throw new Error('Report markdown missing follow-up elevation/coords section');
}
console.log('✓ Test 6 Passed: Report Markdown matches data and requirements');

// Test 7: Verify specific metadata accuracy fixes
const s404 = results.find(r => r.id === 'ski_ski404');
if (!s404.referenceData.url.includes('r0814')) throw new Error(`ski_ski404 expected r0814, got ${s404.referenceData.url}`);

const s171 = results.find(r => r.id === 'ski_ski171');
if (!s171.referenceData.url.includes('r0693')) throw new Error(`ski_ski171 expected r0693, got ${s171.referenceData.url}`);

const s292 = results.find(r => r.id === 'ski_ski292');
if (!s292.referenceData.url.includes('r0275')) throw new Error(`ski_ski292 expected r0275, got ${s292.referenceData.url}`);

const s562 = results.find(r => r.id === 'ski_ski562');
if (s562.referenceData.url !== 'https://awasuno.com/') throw new Error(`ski_ski562 expected awasuno.com, got ${s562.referenceData.url}`);

const s443 = results.find(r => r.id === 'ski_ski443');
if (!s443.evidence.notes.includes('一の瀬ファミリー')) throw new Error(`ski_ski443 notes missing expected text`);
console.log('✓ Test 7 Passed: Specific resort metadata accuracy confirmed');

// Test 8: Verify no unintended duplicate resort codes
const allowedDuplicates = new Set(['r0280', 'r1022', 'r0023', 'r0275', 'r0202']);
const codeCounts = {};
for (const r of operating) {
  if (r.evidence && r.evidence.resortCode) {
    const code = r.evidence.resortCode;
    codeCounts[code] = (codeCounts[code] || 0) + 1;
  }
}
for (const [code, count] of Object.entries(codeCounts)) {
  if (count > 1 && !allowedDuplicates.has(code)) {
    throw new Error(`Unallowed duplicate resortCode ${code} matched ${count} times`);
  }
}
console.log('✓ Test 8 Passed: No unauthorized duplicate resort codes in operating results');

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
