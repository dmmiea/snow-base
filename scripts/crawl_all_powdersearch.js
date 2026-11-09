const fs = require('fs');

const visitedPages = new Set();
const allSkiList = [];
const allMountainList = [];

function dmsToDecimal(dmsStr) {
  // 例: N37°7′41″ または N37°7'41" / E140°0′56″
  try {
    const latMatch = dmsStr.match(/N\s*([0-9]+)[°度]\s*([0-9]+)[′'分]\s*([0-9\.]+)[″"秒]?/i);
    const lonMatch = dmsStr.match(/E\s*([0-9]+)[°度]\s*([0-9]+)[′'分]\s*([0-9\.]+)[″"秒]?/i);
    let lat = null;
    let lon = null;
    if (latMatch) {
      lat = parseFloat(latMatch[1]) + parseFloat(latMatch[2]) / 60 + parseFloat(latMatch[3]) / 3600;
      lat = Math.round(lat * 10000) / 10000;
    }
    if (lonMatch) {
      lon = parseFloat(lonMatch[1]) + parseFloat(lonMatch[2]) / 60 + parseFloat(lonMatch[3]) / 3600;
      lon = Math.round(lon * 10000) / 10000;
    }
    return { lat, lon };
  } catch (e) {
    return { lat: null, lon: null };
  }
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const iconv = new TextDecoder('shift_jis');
    return iconv.decode(buf);
  } catch (e) {
    return null;
  }
}

// 1. スキー場ページの巡回
async function crawlSkiHub() {
  const regions = ['ski_hokkaido.html', 'ski_tohoku.html', 'ski_kanto.html', 'ski_tokai.html', 'ski_kinki.html', 'ski_shikoku.html'];
  const prefPages = [];

  for (const r of regions) {
    const html = await fetchHtml('https://powdersearch.jp/' + r);
    if (!html) continue;
    const matches = [...html.matchAll(/href="([^"]+)"/gi)];
    for (const m of matches) {
      const link = m[1];
      if (link.startsWith('ski_') && link.endsWith('.html') && !regions.includes(link) && !prefPages.includes(link)) {
        prefPages.push(link);
      }
    }
  }

  console.log(`都道府県・エリア別スキーページ数: ${prefPages.length}`);

  const skiDetailPages = [];
  for (const pp of prefPages) {
    const html = await fetchHtml('https://powdersearch.jp/' + pp);
    if (!html) continue;
    const matches = [...html.matchAll(/href="(ski[0-9]+\.html)"[^>]*>([0-9]+\.)?([^<]+)<\/a>/gi)];
    for (const m of matches) {
      const page = m[1];
      const rawName = m[3].trim();
      if (!skiDetailPages.some(x => x.page === page)) {
        skiDetailPages.push({ page, name: rawName, prefPage: pp });
      }
    }
  }

  console.log(`全スキー場詳細ページ数: ${skiDetailPages.length}`);

  // 各スキー場詳細を取得（並行して高速取得）
  const CONCURRENCY = 15;
  for (let i = 0; i < skiDetailPages.length; i += CONCURRENCY) {
    const batch = skiDetailPages.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (item) => {
      const html = await fetchHtml('https://powdersearch.jp/' + item.page);
      if (!html) return;

      // エリア抽出
      let area = '';
      const areaMatch = html.match(/<th>エリア<\/th><td>([^<]*)<\/td>/i);
      if (areaMatch) area = areaMatch[1].trim();

      // 緯度経度抽出
      let lat = null, lon = null;
      const coordMatch = html.match(/<th>緯度経度<\/th><td>([^<]*)<\/td>/i);
      if (coordMatch) {
        const coords = dmsToDecimal(coordMatch[1]);
        lat = coords.lat;
        lon = coords.lon;
      }

      // 最寄りアメダス抽出 (1番目の観測地点)
      let amedasId = null;
      let amedasName = null;
      const amedasMatch = html.match(/href="([0-9]+)d3g\.html"[^>]*>([0-9]+\.)?([^<]+)<\/a>/i);
      if (amedasMatch) {
        amedasId = amedasMatch[1];
        amedasName = amedasMatch[3].trim();
      }

      if (lat && lon) {
        allSkiList.push({
          id: `ski_${item.page.replace('.html', '')}`,
          name: item.name,
          category: 'ski',
          areaName: area,
          lat,
          lon,
          amedasId,
          amedasName,
          sourcePage: item.page
        });
      }
    }));

    if (i % 60 === 0) {
      console.log(`取得進捗: ${allSkiList.length} / ${skiDetailPages.length}`);
    }
  }

  console.log(`スキー場取得完了！有効件数: ${allSkiList.length}`);
}

// 2. 山岳ページの巡回
async function crawlMountainHub() {
  const regions = ['mt_hokkaido.html', 'mt_tohoku.html', 'mt_kanto.html', 'mt_tokai.html', 'mt_kinki.html', 'mt_shikoku.html'];
  const prefPages = [];

  for (const r of regions) {
    const html = await fetchHtml('https://powdersearch.jp/' + r);
    if (!html) continue;
    const matches = [...html.matchAll(/href="([^"]+)"/gi)];
    for (const m of matches) {
      const link = m[1];
      if (link.startsWith('mt_') && link.endsWith('.html') && !regions.includes(link) && !prefPages.includes(link)) {
        prefPages.push(link);
      }
    }
  }

  console.log(`都道府県・エリア別山岳ページ数: ${prefPages.length}`);

  const mtDetailPages = [];
  for (const pp of prefPages) {
    const html = await fetchHtml('https://powdersearch.jp/' + pp);
    if (!html) continue;
    const matches = [...html.matchAll(/href="(mt[0-9]+\.html)"[^>]*>([0-9]+\.)?([^<]+)<\/a>/gi)];
    for (const m of matches) {
      const page = m[1];
      const rawName = m[3].trim();
      if (!mtDetailPages.some(x => x.page === page)) {
        mtDetailPages.push({ page, name: rawName, prefPage: pp });
      }
    }
  }

  console.log(`全山岳詳細ページ数: ${mtDetailPages.length}`);

  const CONCURRENCY = 15;
  for (let i = 0; i < mtDetailPages.length; i += CONCURRENCY) {
    const batch = mtDetailPages.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (item) => {
      const html = await fetchHtml('https://powdersearch.jp/' + item.page);
      if (!html) return;

      let area = '';
      const areaMatch = html.match(/<th>エリア<\/th><td>([^<]*)<\/td>/i);
      if (areaMatch) area = areaMatch[1].trim();

      let lat = null, lon = null;
      const coordMatch = html.match(/<th>緯度経度<\/th><td>([^<]*)<\/td>/i);
      if (coordMatch) {
        const coords = dmsToDecimal(coordMatch[1]);
        lat = coords.lat;
        lon = coords.lon;
      }

      let amedasId = null;
      let amedasName = null;
      const amedasMatch = html.match(/href="([0-9]+)d3g\.html"[^>]*>([0-9]+\.)?([^<]+)<\/a>/i);
      if (amedasMatch) {
        amedasId = amedasMatch[1];
        amedasName = amedasMatch[3].trim();
      }

      if (lat && lon) {
        allMountainList.push({
          id: `bc_${item.page.replace('.html', '')}`,
          name: item.name,
          category: 'bc',
          areaName: area,
          lat,
          lon,
          amedasId,
          amedasName,
          sourcePage: item.page
        });
      }
    }));
  }

  console.log(`山岳取得完了！有効件数: ${allMountainList.length}`);
}

async function run() {
  await crawlSkiHub();
  await crawlMountainHub();

  const total = [...allSkiList, ...allMountainList];
  console.log(`=== 総計: スキー場 ${allSkiList.length} 件 ＋ 山岳 ${allMountainList.length} 件 ＝ 合計 ${total.length} 件 ===`);
  fs.writeFileSync('crawled_all_japan.json', JSON.stringify(total, null, 2), 'utf8');
}

run();
