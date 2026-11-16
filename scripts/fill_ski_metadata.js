import fs from 'fs';
import path from 'path';

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function main() {
  const rulesPath = path.join(process.cwd(), 'spot_rules_japan.json');
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

  // 1. 調査結果ファイルおよびWeathernewsデータから prefecture 情報をマッピング
  const invPath = path.join(process.cwd(), 'scripts', 'ski_resorts_investigation_results.json');
  const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
  const invMap = new Map(inv.map(r => [r.id, r]));

  const resWn = await fetch('https://site.weathernews.jp/site/ski/json/searchdata.json', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const wnList = await resWn.json();

  // 2. 気象庁アメダス観測所一覧を取得（最新マップJSONから全地点を抽出）
  const timeRes = await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt');
  const timeText = (await timeRes.text()).trim();
  const timeStr = timeText.replace(/[-:T\+]/g, '').slice(0, 14);
  const jmaUrl = `https://www.jma.go.jp/bosai/amedas/data/map/${timeStr}.json`;
  const jmaRes = await fetch(jmaUrl);
  const jmaMap = await jmaRes.json();

  // 気象庁アメダステーブル（amedas_table.json または 既存スポットのamedasから辞書作成）
  const amedasDict = new Map();
  // 既存スポットで amedasId と座標があるもの
  rules.forEach(s => {
    if (s.amedasId && s.amedasName && s.base?.lat && s.base?.lon) {
      if (!amedasDict.has(s.amedasId)) {
        amedasDict.set(s.amedasId, { id: s.amedasId, name: s.amedasName, lat: s.base.lat, lon: s.base.lon });
      }
    }
  });

  // 愛媛県周辺の主要アメダス観測所（久万、成就社、大洲など）
  // 久万アメダス: 73266 (久万, 北緯33.659, 東経132.906)
  // 成就社アメダス: 73221 (成就社, 北緯33.770, 東経133.125)
  // 小田深山/内子アメダス: 73296 (獅子越峠 / 久万高原)
  const ehimeAmedas = {
    ski_ski674: { amedasId: '73266', amedasName: '久万' },       // 久万スキーランド
    ski_ski673: { amedasId: '73221', amedasName: '成就社' },     // 石鎚
    ski_ski676: { amedasId: '73266', amedasName: '久万' },       // ソルファオダスキーゲレンデ (最寄りは久万/獅子越峠)
  };

  let prefFilled = 0;
  let amedasFilled = 0;

  for (const s of rules) {
    if (s.category !== 'ski') continue;

    // prefecture 補完
    if (!s.prefecture) {
      const invData = invMap.get(s.id);
      if (invData && invData.prefecture) {
        s.prefecture = invData.prefecture;
        prefFilled++;
      } else if (invData && invData.evidence && invData.evidence.prefecture) {
        s.prefecture = invData.evidence.prefecture;
        prefFilled++;
      } else {
        // areaName や regionName から推定
        if (s.regionName === '北海道' || s.region === 'hokkaido') s.prefecture = '北海道';
        else if (s.areaName && s.areaName.includes('青森')) s.prefecture = '青森県';
        else if (s.areaName && s.areaName.includes('岩手')) s.prefecture = '岩手県';
        else if (s.areaName && s.areaName.includes('秋田')) s.prefecture = '秋田県';
        else if (s.areaName && s.areaName.includes('宮城')) s.prefecture = '宮城県';
        else if (s.areaName && s.areaName.includes('山形')) s.prefecture = '山形県';
        else if (s.areaName && s.areaName.includes('福島')) s.prefecture = '福島県';
        else if (s.areaName && s.areaName.includes('新潟')) s.prefecture = '新潟県';
        else if (s.areaName && s.areaName.includes('群馬')) s.prefecture = '群馬県';
        else if (s.areaName && s.areaName.includes('長野')) s.prefecture = '長野県';
        else if (s.areaName && s.areaName.includes('岐阜')) s.prefecture = '岐阜県';
        else if (s.areaName && s.areaName.includes('富山')) s.prefecture = '富山県';
        else if (s.areaName && s.areaName.includes('石川')) s.prefecture = '石川県';
        else if (s.areaName && s.areaName.includes('福井')) s.prefecture = '福井県';
        else if (s.areaName && s.areaName.includes('山梨')) s.prefecture = '山梨県';
        else if (s.areaName && s.areaName.includes('静岡')) s.prefecture = '静岡県';
        else if (s.areaName && s.areaName.includes('愛知')) s.prefecture = '愛知県';
        else if (s.areaName && s.areaName.includes('三重')) s.prefecture = '三重県';
        else if (s.areaName && s.areaName.includes('滋賀')) s.prefecture = '滋賀県';
        else if (s.areaName && s.areaName.includes('京都')) s.prefecture = '京都府';
        else if (s.areaName && s.areaName.includes('兵庫')) s.prefecture = '兵庫県';
        else if (s.areaName && s.areaName.includes('鳥取')) s.prefecture = '鳥取県';
        else if (s.areaName && s.areaName.includes('島根')) s.prefecture = '島根県';
        else if (s.areaName && s.areaName.includes('岡山')) s.prefecture = '岡山県';
        else if (s.areaName && s.areaName.includes('広島')) s.prefecture = '広島県';
        else if (s.areaName && s.areaName.includes('愛媛')) s.prefecture = '愛媛県';
        else if (s.areaName && s.areaName.includes('徳島')) s.prefecture = '徳島県';
        else if (s.areaName && s.areaName.includes('大分')) s.prefecture = '大分県';
        else if (s.areaName && s.areaName.includes('宮崎')) s.prefecture = '宮崎県';
        
        if (s.prefecture) prefFilled++;
      }
    }

    // amedas 補完
    if (!s.amedasId || !s.amedasName) {
      if (ehimeAmedas[s.id]) {
        s.amedasId = ehimeAmedas[s.id].amedasId;
        s.amedasName = ehimeAmedas[s.id].amedasName;
        // 愛媛県の地域区分整合性
        s.region = 'shikoku';
        s.regionName = '四国';
        s.prefecture = '愛媛県';
        amedasFilled++;
      }
    }
  }

  fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2) + '\n', 'utf8');

  // 検証
  const skiSpots = rules.filter(s => s.category === 'ski');
  const missingPref = skiSpots.filter(s => !s.prefecture).length;
  const missingAmedas = skiSpots.filter(s => !s.amedasId || !s.amedasName).length;

  console.log(`prefecture 補完: ${prefFilled} 件 (残り未設定: ${missingPref})`);
  console.log(`amedas 補完: ${amedasFilled} 件 (残り未設定: ${missingAmedas})`);
  console.log(`スキー場総数: ${skiSpots.length} 件`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
