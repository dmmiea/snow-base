import fs from 'fs';
import path from 'path';

// SURF&SNOW・Weathernewsのいずれにも未掲載の41件
const DELETE_IDS = new Set([
  'ski_ski1',   // 礼文町富士見ヶ丘
  'ski_ski4',   // 利尻町天望山
  'ski_ski2',   // 礼文町久種湖畔
  'ski_ski3',   // 利尻鴛泊
  'ski_ski23',  // 下川町営下川
  'ski_ski28',  // あいべつファミリー
  'ski_ski36',  // 北竜町碧水
  'ski_ski47',  // 美瑛町民
  'ski_ski54',  // 占冠中央
  'ski_ski74',  // 風の丘公園
  'ski_ski76',  // 宮の森
  'ski_ski81',  // 佐呂間町営
  'ski_ski85',  // 訓子府町営
  'ski_ski89',  // 津別町ファミリー
  'ski_ski92',  // 国設ウトロ
  'ski_ski95',  // 小清水町民
  'ski_ski93',  // 標津町金山
  'ski_ski108', // 里見が丘公園
  'ski_ski113', // 穂別町営
  'ski_ski106', // 若葉
  'ski_ski119', // 千歳市民
  'ski_ski139', // 野外スポーツ林
  'ski_ski149', // ウインザースノービレッジ
  'ski_ski158', // ひらたない
  'ski_ski151', // 長万部町営
  'ski_ski198', // 由利本荘市大平
  'ski_ski201', // 子安温泉
  'ski_ski219', // 志賀来
  'ski_ski215', // 生出
  'ski_ski228', // 祭畤スノーランド
  'ski_ski230', // 秋山
  'ski_ski240', // 湯の台
  'ski_ski249', // 小鳥山
  'ski_ski244', // 八森山
  'ski_ski263', // 川西町小松
  'ski_ski261', // 道照寺平
  'ski_ski343', // 佐渡市営平
  'ski_ski390', // 冬鳥越スキーガーデン
  'ski_ski392', // 国営越後丘陵公園
  'ski_ski429', // 志賀高原 木戸池
  'ski_ski665', // 三井野原
]);

// 低信ぴょう性スポットの公式調査済み標高・座標補正
const FIXES = {
  ski_ski437: { baseElev: 1330, topElev: 1570, baseLat: 36.72056, baseLon: 138.50333 }, // 志賀高原 ブナ平
  ski_ski441: { baseElev: 1905, topElev: 2060, baseLat: 36.72917, baseLon: 138.52639 }, // 志賀高原 寺子屋
  ski_ski43:  { baseElev: 1100, topElev: 1600 }, // 旭岳（ロープウェイ山麓〜姿見駅）
  ski_ski296: { baseElev: 570,  topElev: 780,  baseLat: 37.750168, baseLon: 139.867288 }, // 三ノ倉（喜多方市三ノ倉）
  ski_ski83:  { baseElev: 10,   topElev: 97 },   // リリー山
  ski_ski20:  { baseElev: 35,   topElev: 180 },  // 羽幌町民スキー場びゅー
  ski_ski10:  { baseElev: 14,   topElev: 70 },   // 幌延町東ヶ丘
  ski_ski177: { baseElev: 295,  topElev: 520 },  // 創遊村229スキーランド
  ski_ski12:  { baseElev: 31,   topElev: 101 },  // 天塩町町民
  ski_ski50:  { baseElev: 180,  topElev: 281 },  // 中富良野北星
  ski_ski62:  { baseElev: 114,  topElev: 194 },  // そっち岳
  ski_ski87:  { baseElev: 230,  topElev: 320 },  // 置戸町南ヶ丘
  ski_ski109: { baseElev: 50,   topElev: 105 },  // 明野ヶ丘
  ski_ski137: { baseElev: 41,   topElev: 161 },  // 仁木町民
  ski_ski163: { baseElev: 25,   topElev: 90 },   // 知内町営
  ski_ski204: { baseElev: 400,  topElev: 532 },  // 村営くのへ
  ski_ski269: { baseElev: 270,  topElev: 360 },  // 手ノ子
  ski_ski358: { baseElev: 487,  topElev: 670 },  // 中里スノーウッド
  ski_ski423: { baseElev: 975,  topElev: 1120 }, // 山田温泉キッズスノーパーク
  ski_ski641: { baseElev: 520,  topElev: 600 },  // りんご今日話国
  ski_ski336: { baseElev: 1120, topElev: 1155 }, // 森のスキー場
};

function main() {
  const rulesPath = path.join(process.cwd(), 'spot_rules_japan.json');
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

  const beforeSki = rules.filter(s => s.category === 'ski').length;
  const beforeBc = rules.filter(s => s.category === 'bc').length;

  const filtered = rules.filter(s => !(s.category === 'ski' && DELETE_IDS.has(s.id)));
  const deletedCount = rules.length - filtered.length;

  let fixedElevCount = 0;
  let fixedCoordCount = 0;

  for (const sp of filtered) {
    if (sp.category !== 'ski') continue;
    const fix = FIXES[sp.id];
    if (!fix) continue;

    if (fix.baseElev !== undefined && fix.topElev !== undefined) {
      sp.base.elevation = fix.baseElev;
      sp.top.elevation = fix.topElev;
      fixedElevCount++;
    }
    if (fix.baseLat !== undefined && fix.baseLon !== undefined) {
      const dLat = fix.baseLat - sp.base.lat;
      const dLon = fix.baseLon - sp.base.lon;
      sp.base.lat = Number(fix.baseLat.toFixed(6));
      sp.base.lon = Number(fix.baseLon.toFixed(6));
      sp.top.lat = Number((sp.top.lat + dLat).toFixed(6));
      sp.top.lon = Number((sp.top.lon + dLon).toFixed(6));
      fixedCoordCount++;
    }
  }

  fs.writeFileSync(rulesPath, JSON.stringify(filtered, null, 2) + '\n', 'utf8');

  const afterSki = filtered.filter(s => s.category === 'ski').length;
  const afterBc = filtered.filter(s => s.category === 'bc').length;
  const reversed = filtered.filter(s => s.top.elevation <= s.base.elevation).length;
  const uniqueIds = new Set(filtered.map(s => s.id)).size;

  console.log(`削除: ${deletedCount} 件 (ski: ${beforeSki} -> ${afterSki}, bc: ${beforeBc} -> ${afterBc}, total: ${filtered.length})`);
  console.log(`標高補正: ${fixedElevCount} 件, 座標補正: ${fixedCoordCount} 件`);
  console.log(`整合性: uniqueIds=${uniqueIds}/${filtered.length}, reversedElev=${reversed}`);
}

main();
