const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// 1. SURF&SNOW Scraping
async function gatherSurfSnow() {
  const cachePath = path.join(__dirname, 'portal_surfsnow.json');
  if (fs.existsSync(cachePath)) {
    console.log('[SURF&SNOW] Loaded from existing cache:', cachePath);
    const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (data.length > 400) return data;
  }

  console.log('[SURF&SNOW] Fetching sitemap-guide.xml...');
  const res = await fetch('https://surfsnow.jp/sitemap-guide.xml', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`Failed to fetch surfsnow sitemap: ${res.status}`);
  const text = await res.text();
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const sPages = [...new Set(locs.filter(l => /r[0-9]+s\.htm$/.test(l)))];
  console.log(`[SURF&SNOW] Found ${sPages.length} resort pages.`);

  const results = [];
  const batchSize = 10;
  for (let i = 0; i < sPages.length; i += batchSize) {
    const batch = sPages.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(async (url) => {
      try {
        const r = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
        if (!r.ok) return null;
        const html = await r.text();
        return parseSurfSnowHtml(url, html);
      } catch (e) {
        console.error(`Error fetching ${url}: ${e.message}`);
        return null;
      }
    }));

    for (const item of batchResults) {
      if (item && item.name) {
        results.push(item);
      }
    }

    if ((i + batchSize) % 50 === 0 || i + batchSize >= sPages.length) {
      console.log(`[SURF&SNOW] Progress: ${Math.min(i + batchSize, sPages.length)} / ${sPages.length}`);
    }
    await sleep(200);
  }

  fs.writeFileSync(cachePath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[SURF&SNOW] Successfully saved ${results.length} resorts to ${cachePath}`);
  return results;
}

function parseSurfSnowHtml(url, html) {
  let name = null;
  let prefecture = null;
  let address = null;
  let lat = null;
  let lon = null;
  let postalCode = null;

  const jsonLds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  for (const j of jsonLds) {
    try {
      const p = JSON.parse(j);
      if (p['@type'] === 'SkiResort') {
        name = p.name;
        if (p.address) {
          prefecture = p.address.addressRegion || null;
          address = p.address.addressLocality || null;
          postalCode = p.address.postalCode || null;
        }
        if (p.geo) {
          lat = parseFloat(p.geo.latitude) || null;
          lon = parseFloat(p.geo.longitude) || null;
        }
      }
    } catch (e) {}
  }

  if (!name) {
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (h1Match) name = h1Match[1].trim();
  }

  let topElev = null;
  let baseElev = null;

  const highMatch = html.match(/<h3\s+class="high">([0-9,]+)m[\s\S]*?PEAK/i);
  if (highMatch) {
    topElev = parseInt(highMatch[1].replace(/,/g, ''), 10);
  } else {
    const m = html.match(/([0-9,]+)\s*m[\s\S]{0,30}?PEAK/i);
    if (m) topElev = parseInt(m[1].replace(/,/g, ''), 10);
  }

  const baseMatch = html.match(/<h3\s+class="base">([0-9,]+)m[\s\S]*?BASE/i);
  if (baseMatch) {
    baseElev = parseInt(baseMatch[1].replace(/,/g, ''), 10);
  } else {
    const m = html.match(/([0-9,]+)\s*m[\s\S]{0,30}?BASE/i);
    if (m) baseElev = parseInt(m[1].replace(/,/g, ''), 10);
  }

  const idMatch = url.match(/r([0-9]+)s\.htm/);
  const resortCode = idMatch ? `r${idMatch[1]}` : null;

  return {
    source: 'SURF&SNOW',
    resortCode,
    name: name ? name.trim() : null,
    prefecture,
    address,
    postalCode,
    lat,
    lon,
    topElev,
    baseElev,
    url,
    status: 'operating'
  };
}

// 2. SnowJapan Scraping
async function gatherSnowJapan() {
  const cachePath = path.join(__dirname, 'portal_snowjapan.json');
  if (fs.existsSync(cachePath)) {
    console.log('[SnowJapan] Loaded from existing cache:', cachePath);
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  }

  console.log('[SnowJapan] Fetching sitemaps...');
  const activeSitemap = 'https://www.snowjapan.com/dynamic-ski-areas-in-japan_p_8232e5e4_417a_426e_8b3c_94dbe2f75bff_0_5000-sitemap.xml';
  const inactiveSitemap = 'https://www.snowjapan.com/dynamic-inactive-ski-areas_p_a8bf0e54_af49_45e6_b180_c9ea0906e738_0_5000-sitemap.xml';

  const resAct = await fetch(activeSitemap, { headers: { 'User-Agent': USER_AGENT } });
  const xmlAct = await resAct.text();
  const actUrls = [...xmlAct.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  const resIn = await fetch(inactiveSitemap, { headers: { 'User-Agent': USER_AGENT } });
  const xmlIn = await resIn.text();
  const inUrls = [...xmlIn.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  console.log(`[SnowJapan] Active URLs: ${actUrls.length}, Inactive URLs: ${inUrls.length}`);

  const resorts = [];

  // Parse active
  for (const url of actUrls) {
    // Example: https://www.snowjapan.com/ski-areas-in-japan/hokkaido/wakkanai-city/kamiyuchi
    // Or: https://www.snowjapan.com/ski-areas-in-japan/nagano-prefecture/hakuba-village/able-hakuba-goryu
    const match = url.match(/\/ski-areas-in-japan\/([^\/]+)\/([^\/]+)\/([^\/]+)/);
    if (match) {
      const prefSlug = match[1];
      const townSlug = match[2];
      const slug = match[3];
      resorts.push({
        source: 'SnowJapan',
        slug,
        prefSlug,
        townSlug,
        url,
        status: 'operating'
      });
    }
  }

  // Parse inactive
  for (const url of inUrls) {
    const match = url.match(/\/inactive-ski-areas\/([^\/]+)/);
    if (match) {
      resorts.push({
        source: 'SnowJapan',
        slug: match[1],
        url,
        status: 'closed_or_inactive'
      });
    }
  }

  fs.writeFileSync(cachePath, JSON.stringify(resorts, null, 2), 'utf8');
  console.log(`[SnowJapan] Saved ${resorts.length} resorts to ${cachePath}`);
  return resorts;
}

// 3. Weathernews Scraping
async function gatherWeathernews() {
  const cachePath = path.join(__dirname, 'portal_weathernews.json');
  if (fs.existsSync(cachePath)) {
    console.log('[Weathernews] Loaded from existing cache:', cachePath);
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  }

  console.log('[Weathernews] Fetching area listings...');
  const regions = [
    'hokkaido', 'tohoku', 'kanto', 'chubu', 'kinki', 'chugoku', 'shikoku', 'kyushu',
    'nagano', 'niigata', 'gunma', 'gifu'
  ];

  const spotMap = new Map();

  for (const reg of regions) {
    const url = `https://weathernews.jp/ski/area/${reg}/`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) continue;
      const html = await res.text();
      const matches = [...html.matchAll(/href="(\/ski\/spot\/([0-9]+)\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
      for (const m of matches) {
        const id = m[2];
        const rawName = m[3].replace(/<[^>]+>/g, '').trim();
        const lines = rawName.split('\n').map(l => l.trim()).filter(Boolean);
        const name = lines[lines.length - 1] || rawName;
        if (name && !spotMap.has(id)) {
          spotMap.set(id, {
            source: 'Weathernews',
            spotId: id,
            name,
            url: `https://weathernews.jp/ski/spot/${id}/`,
            region: reg,
            status: 'operating'
          });
        }
      }
    } catch (e) {
      console.error(`WNI area ${reg} error: ${e.message}`);
    }
  }

  const results = Array.from(spotMap.values());
  fs.writeFileSync(cachePath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[Weathernews] Saved ${results.length} spots to ${cachePath}`);
  return results;
}

async function main() {
  console.log('=== Starting Portal Data Gathering ===');
  const surfsnow = await gatherSurfSnow();
  const snowjapan = await gatherSnowJapan();
  const wni = await gatherWeathernews();

  console.log('=== Gathering Complete ===');
  console.log(`SURF&SNOW: ${surfsnow.length}`);
  console.log(`SnowJapan: ${snowjapan.length}`);
  console.log(`Weathernews: ${wni.length}`);
}

main().catch(console.error);
