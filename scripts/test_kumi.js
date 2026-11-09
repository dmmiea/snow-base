async function test() {
  const query = `[out:json][timeout:30];
(
  node["aerialway"="station"](35.0,136.0,37.5,139.0);
);
out count;`;
  try {
    const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await res.json();
    console.log('Aerialway stations in Chubu/Shinetsu:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
