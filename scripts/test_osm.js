async function testOverpass() {
  const query = `[out:json][timeout:60];
area["ISO3166-1"="JP"][admin_level=2]->.japan;
(
  relation["landuse"="winter_sports"](area.japan);
  way["landuse"="winter_sports"](area.japan);
);
out tags center;`;
  
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await res.json();
    console.log('Winter sports count in Japan:', data.elements ? data.elements.length : 0);
    if (data.elements && data.elements.length > 0) {
      console.log('Sample 0:', JSON.stringify(data.elements[0], null, 2));
      const withName = data.elements.filter(e => e.tags && (e.tags.name || e.tags['name:ja']));
      console.log('With Japanese name count:', withName.length);
      console.log('First 5 names:', withName.slice(0, 5).map(e => e.tags['name:ja'] || e.tags.name));
    }
  } catch (err) {
    console.error('Overpass error:', err.message);
  }
}
testOverpass();
