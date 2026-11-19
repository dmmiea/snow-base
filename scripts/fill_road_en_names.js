const fs = require('fs');
const path = require('path');

const enNamesFile = path.join(__dirname, '..', 'en_names.json');
const enNames = JSON.parse(fs.readFileSync(enNamesFile, 'utf8'));

// 道路観測所の漢字→ローマ字マッピング
const KANJI_MAP = {
  '稲穂峠': 'Inaho Pass',
  '西大沼': 'Nishi-Onuma',
  '新道': 'Shindo',
  '小湊': 'Kominato',
  '美利河峠': 'Pirika Pass',
  '白鳥大橋': 'Hakucho Bridge',
  '坪': 'Tsubo',
  '荒川': 'Arakawa',
  '大曲国道': 'Omagari Kokudo',
  '橋場': 'Hashiba',
  '橋場ＳＴ': 'Hashiba Base',
  '小鳥谷ＢＰ': 'Kotoriya Bypass',
  '奥中山（積雪）': 'Oku-Nakayama',
  '銀河大橋': 'Ginga Bridge',
  '上有住': 'Kami-Arisu',
  '余目除雪ST': 'Amarume Snow Base',
  '柳原': 'Yanagihara',
  '上楓沢橋': 'Kamikaedesawa Bridge',
  '入間向観測所': 'Irumamuki Station',
  '横岫': 'Yokoguki',
  '大網': 'Oami',
  '堺田': 'Sakaida',
  '横根観測所': 'Yokone Station',
  '飯豊': 'Iide',
  '水窪第一トンネル': 'Misakubo No.1 Tunnel',
  '作並除雪ST': 'Sakunami Snow Base',
  '大谷橋': 'Otani Bridge',
  '熊ヶ根': 'Kumagane',
  '熱海高玉': 'Atami-Takadama',
  '猪苗代(長浜）': 'Inawashiro Nagahama',
  '七折峠TN新潟': 'Nanaori Pass Tunnel',
  '上白井': 'Kamishirai',
  '新発田': 'Shibata',
  '赤岩': 'Akaiwa',
  '七谷切': 'Nanatanikiri',
  '関川': 'Sekikawa',
  '蒲萄': 'Budo',
  '神立': 'Kandatsu',
  '大和': 'Yamato',
  '六日町跨線橋': 'Muikamachi Bridge',
  '坂塚': 'Sakatsuka',
  '妙高': 'Myoko',
  '糸魚川': 'Itoigawa',
  'ワサビ沢橋': 'Wasabisawa Bridge',
  '川谷': 'Kawatani',
  '上田': 'Ueda',
  '牟礼': 'Mure',
  '坂室': 'Sakamuro',
  '下蔦木': 'Shimo-Tsutaki',
  '菅': 'Suge',
  '桔梗ヶ原': 'Kikyogahara',
  '新開': 'Shinkai',
  '伊豆木': 'Izuki',
  '治部坂': 'Jibusaka',
  '漆脇': 'Urushiwaki',
  '平谷': 'Hiratani',
  '数河': 'Sugou',
  '野口': 'Noguchi',
  '根羽': 'Neba',
  '籠坂': 'Kagosaka',
  '宮峠トンネル': 'Miyatoge Tunnel',
  '土山': 'Tsuchiyama',
  '楡原': 'Nirehara',
  '小牧': 'Komaki',
  '千木野': 'Chigino',
  '七尾除雪': 'Nanao Snow Base',
  '九頭竜IC': 'Kuzuryu IC',
  '月浦': 'Tsukiura',
  '杉津': 'Suizu',
  '山中': 'Yamanaka',
  '高島': 'Takashima',
  '南小松': 'Minami-Komatsu',
  '入江': 'Irie',
  '春来': 'Haruki',
  '稲葉川橋': 'Inabagawabashi',
  '智頭用瀬': 'Chizu-Mochigase',
  '志戸坂': 'Shidosaka',
  '高野IC': 'Takano IC',
  '小船': 'Kobune',
  '徳佐': 'Tokusa',
  '大山': 'Daisen',
  '三朝': 'Misasa',
  '奥津': 'Okutsu',
  '蒜山': 'Hiruzen',
  '庄原': 'Shobara',
  '吉舎': 'Kisa',
  '芸北': 'Geihoku',
  '筒賀': 'Tsutsuga',
  '冠山': 'Kanmuriyama',
  '恐羅漢': 'Osorakan',
  '十和': 'Towa',
  '梼原': 'Yusuhara',
  '久万': 'Kuma',
  '祖谷': 'Iya',
  '阿波池田': 'Awa-Ikeda',
  '美馬': 'Mima',
  '剣山': 'Tsurugisan'
};

const spots = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spot_rules_japan.json'), 'utf8'));
let count = 0;
for (const s of spots) {
  for (const k of ['roadStationName', 'amedasName']) {
    const val = s[k];
    if (val && (!enNames[val] || /[\u3000-\u9faf]/.test(enNames[val]))) {
      if (KANJI_MAP[val]) {
        enNames[val] = KANJI_MAP[val];
        count++;
      } else {
        // フォールバック
        enNames[val] = val.replace(/峠/g, ' Pass').replace(/橋/g, ' Bridge').replace(/トンネル/g, ' Tunnel');
      }
    }
  }
}

console.log('Mapped road kanji names to English:', count);
fs.writeFileSync(enNamesFile, JSON.stringify(enNames, null, 2), 'utf8');
