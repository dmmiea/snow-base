const fs = require('fs');

const visited = new Set();
const skiSpots = [];
const mountainSpots = [];

async function fetchPage(url) {
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const iconv = new TextDecoder('shift_jis');
    return iconv.decode(buf);
  } catch (e) {
    return null;
  }
}

async function crawlSki(pageUrl) {
  if (visited.has(pageUrl)) return;
  visited.add(pageUrl);

  const html = await fetchPage('https://powdersearch.jp/' + pageUrl);
  if (!html) return;

  // リンク抽出
  const regex = /<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;
  let match;
  const subPages = [];

  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const name = match[2].trim();

    if (href.startsWith('ski_') && href.endsWith('.html')) {
      subPages.push(href);
    } else if (href.includes('d3g.html') || href.includes('map_point.html')) {
      // 観測所ページへのリンクを持つスキー場
      skiSpots.push({
        name,
        href,
        fromPage: pageUrl
      });
    }
  }

  for (const sub of subPages) {
    await crawlSki(sub);
  }
}

async function main() {
  console.log('スキー場クロール開始...');
  await crawlSki('area3.html');
  console.log('見つかったスキー場リンク数:', skiSpots.length);
  fs.writeFileSync('crawled_ski.json', JSON.stringify(skiSpots, null, 2), 'utf8');
}

main();
