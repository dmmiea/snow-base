(async () => {
  const fs = require('fs');
  const path = require('path');

  // 1. 気象庁アメダステーブルと正時マップ取得
  const table = await (await fetch('https://www.jma.go.jp/bosai/amedas/const/amedastable.json')).json();
  const timeText = (await (await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt')).text()).trim();
  const hourTimeStr = timeText.replace(/[-:T\+]/g, '').slice(0, 10) + '0000';
  const mapHour = await (await fetch('https://www.jma.go.jp/bosai/amedas/data/map/' + hourTimeStr + '.json')).json();

  const activeSnowStations = [];
  for (const [id, info] of Object.entries(table)) {
    if (mapHour[id] && mapHour[id].snow && mapHour[id].snow[0] !== null) {
      activeSnowStations.push({
        id,
        name: info.kjName,
        enName: info.enName || '',
        lat: info.lat[0] + info.lat[1] / 60,
        lon: info.lon[0] + info.lon[1] / 60
      });
    }
  }

  // 2. 国交省 道路雪量計取得
  const base = 'https://www.road-info-prvs.mlit.go.jp/roadinfo/pc/';
  const rTop = await fetch(base + 'pcKisho_81_3.html');
  const html = await rTop.text();
  const backupMatch = html.match(/(\.\.\/backup\/[^"']+\.js)/);
  const configJs = await (await fetch(new URL(backupMatch[1], base).href)).text();
  const jsonBase = new URL(configJs.match(/CREATE_JSON_PATH\s*=\s*"([^"]+)"/)[1], base).href;

  const roadStations = [];
  for (const cd of ['81', '82', '83', '84', '85', '86', '87']) {
    const res = await fetch(`${jsonBase}Kisho/${cd}.json`);
    if (!res.ok) continue;
    const data = await res.json();
    const walk = (node) => {
      if (Array.isArray(node)) node.forEach(walk);
      else if (node && typeof node === 'object') {
        if ('sensor_id' in node && node.sekisetsushin_flag === '1') {
          let lat = null, lon = null;
          try {
            const g = JSON.parse(node.gis_point);
            lon = g.coordinates[0];
            lat = g.coordinates[1];
          } catch (e) {}
          if (lat !== null && lon !== null) {
            roadStations.push({
              id: String(node.sensor_id),
              name: node.pc_hyoji_meisho || node.sumaho_hyoji_meisho || '',
              area: node.area_name || '',
              city: node.cities_name || '',
              route: node.rosen_meisho || '',
              lat, lon
            });
          }
        } else {
          Object.values(node).forEach(walk);
        }
      }
    };
    walk(data);
  }

  console.log(`Active JMA: ${activeSnowStations.length}, MLIT road: ${roadStations.length}`);

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const spotsFile = path.join(__dirname, '..', 'spot_rules_japan.json');
  const spots = JSON.parse(fs.readFileSync(spotsFile, 'utf8'));

  let roadCloserCount = 0;
  const newNames = new Set();

  for (const s of spots) {
    // 1. JMAアメダスを公式kjNameで再同期
    let bestJma = null, bestJmaD = Infinity;
    for (const j of activeSnowStations) {
      const d = haversine(s.base.lat, s.base.lon, j.lat, j.lon);
      if (d < bestJmaD) {
        bestJmaD = d;
        bestJma = j;
      }
    }
    s.amedasId = bestJma.id;
    s.amedasName = bestJma.name;
    newNames.add(bestJma.name);

    // 2. 国交省 道路雪量計の探索
    let bestRoad = null, bestRoadD = Infinity;
    for (const r of roadStations) {
      const d = haversine(s.base.lat, s.base.lon, r.lat, r.lon);
      if (d < bestRoadD) {
        bestRoadD = d;
        bestRoad = r;
      }
    }

    if (bestRoad && bestRoadD < bestJmaD) {
      roadCloserCount++;
      s.roadStationId = bestRoad.id;
      s.roadStationName = bestRoad.name;
      s.roadStationRoute = bestRoad.route;
      newNames.add(bestRoad.name);
    } else {
      delete s.roadStationId;
      delete s.roadStationName;
      delete s.roadStationRoute;
    }
  }

  console.log(`Updated spots. Closer road stations: ${roadCloserCount} / ${spots.length}`);
  fs.writeFileSync(spotsFile, JSON.stringify(spots, null, 2), 'utf8');

  // en_names.json に新規名称を追加
  const enNamesFile = path.join(__dirname, '..', 'en_names.json');
  const enNames = JSON.parse(fs.readFileSync(enNamesFile, 'utf8'));
  let addedEn = 0;
  for (const name of newNames) {
    if (!enNames[name]) {
      enNames[name] = name;
      addedEn++;
    }
  }
  console.log('Added new station names to en_names.json:', addedEn);
  fs.writeFileSync(enNamesFile, JSON.stringify(enNames, null, 2), 'utf8');
})();
