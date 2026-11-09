const fs = require('fs');

async function crawl() {
  const skiPages = [
    { page: 'ski_hokkaido.html', region: 'hokkaido', regionName: '北海道' },
    { page: 'ski_tohoku.html', region: 'tohoku', regionName: '東北' },
    { page: 'ski_kanto.html', region: 'kanto_koushinetsu', regionName: '関東甲信越' },
    { page: 'ski_tokai.html', region: 'tokai_hokuriku', regionName: '東海・北陸' },
    { page: 'ski_kinki.html', region: 'kinki_chugoku', regionName: '近畿・中国' },
    { page: 'ski_shikoku.html', region: 'shikoku_kyushu', regionName: '四国・九州' }
  ];
  const iconv = new TextDecoder('shift_jis');
  let allSki = [];

  for (const p of skiPages) {
    try {
      const res = await fetch('https://powdersearch.jp/' + p.page);
      const buf = await res.arrayBuffer();
      const html = iconv.decode(buf);
      
      const regex = /<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        const href = match[1];
        const name = match[2].trim();
        if (!href.startsWith('ski_') && !href.includes('index') && !href.includes('area') && !name.includes('ホーム') && !name.includes('戻る')) {
          allSki.push({
            name,
            href,
            region: p.region,
            regionName: p.regionName
          });
        }
      }
    } catch (e) {
      console.error(p.page, e.message);
    }
  }

  console.log('Total ski spots found in PowderSearch:', allSki.length);
  fs.writeFileSync('powdersearch_ski_list.json', JSON.stringify(allSki, null, 2), 'utf8');
}

crawl();
