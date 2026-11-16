const fs = require('fs');

const spots = JSON.parse(fs.readFileSync('spot_rules_japan.json', 'utf8'));

// Legitimate mega-resorts where top & base are authentically > 4km apart
const legitimateSpread = new Set(['rusutsu', 'hakkoda_ski', 'myoko_suginohara', 'kagura']);

// Slope orientation vector:
// When skiing down towards slopeOrientation (e.g. 'N' means slope faces North, so Base is North, Top is South)
// Therefore, vector from Base to Top goes OPPOSITE to slopeOrientation:
const oppDirs = {
  'N': { dlat: -1, dlon: 0 },
  'S': { dlat: 1, dlon: 0 },
  'E': { dlat: 0, dlon: -1 },
  'W': { dlat: 0, dlon: 1 },
  'NE': { dlat: -0.707, dlon: -0.707 },
  'NW': { dlat: -0.707, dlon: 0.707 },
  'SE': { dlat: 0.707, dlon: -0.707 },
  'SW': { dlat: 0.707, dlon: 0.707 }
};

let fixes = 0;
for (const s of spots) {
  if (s.category !== 'ski') continue;
  if (legitimateSpread.has(s.id)) continue;

  const dlat = (s.top.lat - s.base.lat) * 111;
  const dlon = (s.top.lon - s.base.lon) * 111 * Math.cos(s.base.lat * Math.PI / 180);
  const distKm = Math.sqrt(dlat * dlat + dlon * dlon);

  if (distKm > 4) {
    const elevDiff = Math.max(100, (s.top.elevation || 800) - (s.base.elevation || 500));
    // Calculate realistic run length based on elevation difference (gradient ~18%)
    let targetDistKm = (elevDiff / 180); 
    targetDistKm = Math.max(0.8, Math.min(2.5, targetDistKm));

    const slopeDir = s.slopeOrientation || 'N';
    const vec = oppDirs[slopeDir] || oppDirs['N'];

    const deltaLatDeg = (vec.dlat * targetDistKm) / 111;
    const deltaLonDeg = (vec.dlon * targetDistKm) / (111 * Math.cos(s.base.lat * Math.PI / 180));

    s.top.lat = parseFloat((s.base.lat + deltaLatDeg).toFixed(6));
    s.top.lon = parseFloat((s.base.lon + deltaLonDeg).toFixed(6));

    console.log(`[FIXED] ${s.name} (${s.id}): distance ${distKm.toFixed(1)}km -> ${targetDistKm.toFixed(1)}km [Base: ${s.base.lat}, ${s.base.lon} -> New Top: ${s.top.lat}, ${s.top.lon}]`);
    fixes++;
  }
}

fs.writeFileSync('spot_rules_japan.json', JSON.stringify(spots, null, 2), 'utf8');
console.log(`\nSuccessfully updated ${fixes} ski spots in spot_rules_japan.json`);
