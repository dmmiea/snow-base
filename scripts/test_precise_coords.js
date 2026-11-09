const fs = require('fs');

async function getGsiElevation(lat, lon) {
  try {
    const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && typeof data.elevation === 'number') {
      return Math.round(data.elevation);
    }
  } catch (e) {
    // fallback
  }
  return null;
}

async function testPreciseCoords() {
  const testSpots = [
    {
      name: "白馬八方尾根スキー場",
      base: { lat: 36.7025, lon: 137.8631, label: "八方ゴンドラ山麓駅(アダム)" },
      top: { lat: 36.7042, lon: 137.8286, label: "八方池山荘(グラートクワッド終点)" }
    },
    {
      name: "ニセコ東急 グラン・ヒラフ",
      base: { lat: 42.8617, lon: 140.7003, label: "ヒラフゴンドラ山麓駅" },
      top: { lat: 42.8753, lon: 140.6728, label: "エース第4リフト終点" }
    },
    {
      name: "野沢温泉スキー場",
      base: { lat: 36.9208, lon: 138.4419, label: "長坂ゴンドラ山麓駅" },
      top: { lat: 36.9014, lon: 138.4858, label: "毛無山頂・やまびこリフト終点" }
    },
    {
      name: "スキージャム勝山",
      base: { lat: 36.0886, lon: 136.5517, label: "リゾートセンター山麓" },
      top: { lat: 36.0822, lon: 136.5886, label: "イリュージョンサイト山頂" }
    }
  ];

  console.log('=== 国土地理院 標高API 照合テスト ===');
  for (const s of testSpots) {
    const baseElev = await getGsiElevation(s.base.lat, s.base.lon);
    const topElev = await getGsiElevation(s.top.lat, s.top.lon);
    console.log(`${s.name}:`);
    console.log(`  山麓: 緯度 ${s.base.lat}, 経度 ${s.base.lon} -> 国土地理院標高: ${baseElev}m (${s.base.label})`);
    console.log(`  山頂: 緯度 ${s.top.lat}, 経度 ${s.top.lon} -> 国土地理院標高: ${topElev}m (${s.top.label})`);
  }
}

testPreciseCoords();
