const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getWeatherInfo(code, snowfall = null, windSpeed = null) {
  const isSnowCode = (code >= 71 && code <= 77) || code === 85 || code === 86;
  const isRainCode = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const hasSnow = snowfall !== null && snowfall !== undefined && snowfall > 0;
  const hasWind = windSpeed !== null && windSpeed !== undefined;

  // 吹雪・大雪・雪・小雪の詳細判別
  if (code >= 95) {
    if (hasWind && windSpeed >= 12 && (hasSnow || isSnowCode)) {
      return { label: '吹雪', icon: '🌬️❄️' };
    }
    return { label: '雷雨/荒天', icon: '⛈️' };
  }
  if (isSnowCode || (hasSnow && !isRainCode)) {
    if (hasWind && windSpeed >= 12 && (isSnowCode || snowfall >= 0.3)) {
      return { label: '吹雪', icon: '🌬️❄️' };
    }
    if (code === 75 || code === 86 || (snowfall !== null && snowfall >= 3.0)) {
      return { label: '大雪', icon: '❄️❄️' };
    }
    if (code === 73 || code === 85 || (snowfall !== null && snowfall >= 0.5)) {
      return { label: '雪', icon: '❄️' };
    }
    if (code === 71 || code === 77 || hasSnow) {
      return { label: '小雪', icon: '🌨️' };
    }
    return { label: '雪', icon: '❄️' };
  }

  if (code === 0) return { label: '快晴', icon: '☀️' };
  if (code === 1 || code === 2) return { label: '晴れ/薄曇', icon: '🌤️' };
  if (code === 3) return { label: '曇り', icon: '☁️' };
  if (code === 45 || code === 48) return { label: '霧/濃霧', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: '霧雨', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { label: '雨', icon: '🌧️' };
  if (code === 66 || code === 67) return { label: 'みぞれ', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { label: 'にわか雨', icon: '🌦️' };
  return { label: '雪', icon: '❄️' };
}

function getWindDirJa(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return '--';
  const dirs = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
  return dirs[Math.round(deg / 45) % 8];
}

function getWindDirDisplay(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return '--';
  const dirs = ['↓ N', '↙ NE', '← E', '↖ SE', '↑ S', '↗ SW', '→ W', '↘ NW'];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

function evaluateBcAlert({ currentSnowDepth, currentTemp, currentWind, isRain, recentSnowfall, snow24h, tempRise24h, isMeltedAndFrozen }) {
  const reasons = [];
  let level = 'LOW';

  if (currentWind >= 15) {
    level = 'HIGH';
    reasons.push(`稜線暴風(${Math.round(currentWind)}m/s)`);
  } else if (currentWind >= 10) {
    if (level !== 'HIGH') level = 'MODERATE';
    reasons.push(`強風・風成雪注意(${Math.round(currentWind)}m/s)`);
  }

  if (snow24h >= 40) {
    level = 'HIGH';
    reasons.push(`急増雪(24h:${Math.round(snow24h)}cm・雪崩警戒)`);
  } else if (snow24h >= 25 && currentWind >= 10) {
    if (level !== 'HIGH') level = 'MODERATE';
    reasons.push(`風雪による吹き溜まり・スラブ注意`);
  }

  if (isRain || (currentTemp >= 1.5 && snow24h >= 10)) {
    level = 'HIGH';
    reasons.push('湿雪・雨による雪崩警戒');
  } else if (tempRise24h >= 6) {
    level = 'HIGH';
    reasons.push(`急昇温(+${Math.round(tempRise24h)}℃)・雪崩警戒`);
  } else if (currentTemp >= 0) {
    if (level !== 'HIGH') level = 'MODERATE';
    reasons.push('気温0℃以上・湿雪/グライド注意');
  }

  if (isMeltedAndFrozen && recentSnowfall >= 10) {
    if (level !== 'HIGH') level = 'MODERATE';
    reasons.push('クラスト上の新雪・弱層注意');
  }

  if (currentSnowDepth < 100) {
    if (level !== 'HIGH') level = 'MODERATE';
    reasons.push('積雪100cm未満・薮/地形注意');
  }

  let label = '比較的安定';
  if (level === 'HIGH') {
    label = `入山警戒 (${reasons[0] || '悪天候'})`;
  } else if (level === 'MODERATE') {
    label = `山岳注意 (${reasons[0] || '気象変化'})`;
  }

  return { level, label, reasons };
}

function evaluateSnowCondition(hourlyData, currentHourIndex, category = 'ski') {
  const isBc = category === 'bc';
  if (!hourlyData || !hourlyData.time || currentHourIndex < 0) {
    return {
      score: null,
      rank: '積雪なし',
      rankEn: 'NO SNOW',
      tag: isBc ? '積雪なし (入山不可)' : '🌱 積雪なし (滑走不可)',
      tags: ['積雪ゼロ', isBc ? '滑走不可' : '滑走不可'],
      bcAlert: isBc ? { level: 'HIGH', label: '積雪なし・滑走不可', reasons: ['積雪ゼロ'] } : null
    };
  }

  const snowDepthArr = hourlyData.snow_depth || hourlyData.snowDepth || [];
  const tempArr = hourlyData.temperature_2m || hourlyData.temperature || [];
  const windArr = hourlyData.wind_speed_10m || hourlyData.windSpeed || [];
  const weatherArr = hourlyData.weather_code || hourlyData.weatherCode || [];
  const snowfallArr = hourlyData.snowfall || [];

  const rawDepth = snowDepthArr[currentHourIndex];
  const currentSnowDepth = hourlyData.snow_depth !== undefined ? (rawDepth || 0) * 100 : (rawDepth || 0);

  // 1. 【最優先】積雪不足判定（滑走不可：30cm未満）
  if (currentSnowDepth < 30 || isNaN(currentSnowDepth)) {
    return {
      score: null,
      rank: '積雪不足',
      rankEn: 'NO SNOW',
      tag: isBc ? '積雪不足 (滑走不可)' : '滑走不可',
      tags: ['積雪30cm未満', isBc ? '薮・岩露出注意' : 'ブッシュ・石注意'],
      bcAlert: isBc ? { level: 'HIGH', label: '積雪不足・滑走不可', reasons: ['積雪30cm未満'] } : null
    };
  }

  // 過去履歴の解析（過去48時間）
  const pastStart = Math.max(0, currentHourIndex - 48);
  let maxPastTemp = -999;
  let minPastTemp = 999;
  let freezePointIdx = -1; // 融解後に再凍結した最後のインデックス

  for (let i = pastStart; i <= currentHourIndex; i++) {
    const t = tempArr[i];
    if (t > maxPastTemp) maxPastTemp = t;
    if (t < minPastTemp) minPastTemp = t;
    if (t <= -1.0 && maxPastTemp >= 2.0) {
      freezePointIdx = i;
    }
  }

  // 凍結後の累積新雪量をカウント（リセットされたか）
  let snowAfterFreeze = 0;
  if (freezePointIdx >= 0) {
    for (let i = freezePointIdx; i <= currentHourIndex; i++) {
      snowAfterFreeze += (snowfallArr[i] || 0);
    }
  }

  // 直近12時間・24時間の新雪量
  let recentSnowfall = 0;
  const recentStart = Math.max(0, currentHourIndex - 12);
  for (let i = recentStart; i <= currentHourIndex; i++) {
    recentSnowfall += (snowfallArr[i] || 0);
  }
  let snow24h = 0;
  const start24h = Math.max(0, currentHourIndex - 23);
  for (let i = start24h; i <= currentHourIndex; i++) {
    snow24h += (snowfallArr[i] || 0);
  }

  const currentTemp = tempArr[currentHourIndex];
  const temp24hAgo = tempArr[start24h] !== undefined ? tempArr[start24h] : currentTemp;
  const tempRise24h = currentTemp - temp24hAgo;
  const currentWind = windArr[currentHourIndex];
  const weatherCode = weatherArr[currentHourIndex];

  let score = 75;
  let rank = isBc ? '安定しまり雪' : 'しまり雪';
  let rankEn = 'PACKED';
  let mainTag = isBc ? '安定コンディション' : '上質バーン';
  const tags = [];

  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isMeltedAndFrozen = freezePointIdx >= 0 && snowAfterFreeze < 30;

  // 2. 雨天・急激融雪判定
  if (isRain || currentTemp >= 6.0) {
    score = 25;
    rank = '雨・融雪';
    rankEn = 'WET/RAIN';
    mainTag = isBc ? '悪天・湿雪雪崩注意' : '雨天・雪面悪化';
    tags.push('融雪注意', isBc ? '入山見送り検討' : '防水ウェア必須');
  }
  // 3. 本格ディープパウダー判定（直近12h降雪 >= 30cm）
  else if (recentSnowfall >= 30) {
    if (currentTemp <= -6.0) {
      score = 95;
      rank = '神パウ';
      rankEn = 'DEEP POWDER';
      mainTag = isBc ? '極上ドライパウダー' : '底付きなし';
      tags.push(isBc ? 'ラッセル覚悟' : '完全リセット', '極上シルキー', '浮遊感');
    } else if (currentTemp >= -0.5) {
      score = 75;
      rank = '重パウ';
      rankEn = 'HEAVY POWDER';
      mainTag = isBc ? '重め新雪・雪崩注意' : '水分多め';
      tags.push('重め新雪', isBc ? '負荷増大' : '浮遊感あり');
    } else {
      score = 90;
      rank = '極上パウ';
      rankEn = 'DEEP POWDER';
      mainTag = isBc ? 'ノートラック期待' : '底付きなし';
      tags.push(isBc ? '急増雪注意' : '完全リセット', '浮遊感');
    }
  }
  // 4. スネパウ / 新雪リセット判定（直近12h降雪 20〜29cm）
  else if (recentSnowfall >= 20) {
    if (isMeltedAndFrozen && snowAfterFreeze < 25) {
      score = 75;
      rank = '良質パウ';
      rankEn = 'CRUST BASE';
      mainTag = isBc ? '弱層・クラスト警戒' : '底付き注意';
      tags.push('下層クラスト', isBc ? '雪崩リスク留意' : '下地硬め');
    } else if (currentTemp >= -0.5) {
      score = 70;
      rank = '重パウ';
      rankEn = 'HEAVY POWDER';
      mainTag = '水分多め';
      tags.push('重め新雪');
    } else if (currentTemp <= -6.0) {
      score = 90;
      rank = '極上パウ';
      rankEn = 'DRY POWDER';
      mainTag = isBc ? 'ドライパウダー' : '面ツルリセット';
      tags.push('極上シルキー', '浮遊感');
    } else {
      score = 85;
      rank = '良質パウ';
      rankEn = 'FRESH SNOW';
      mainTag = isBc ? '新雪良好' : '面ツルリセット';
      tags.push('浮遊感あり');
    }
  }
  // 5. ちょいパウ / スネ下判定（直近12h降雪 10〜19cm）
  else if (recentSnowfall >= 10) {
    if (isMeltedAndFrozen) {
      score = 68;
      rank = 'ちょいパウ';
      rankEn = 'CRUST BASE';
      mainTag = isBc ? 'クラスト上の新雪' : '底付き注意';
      tags.push('下層クラスト', isBc ? '弱層注意' : '下地硬め');
    } else if (currentTemp >= -0.5) {
      score = 65;
      rank = '重パウ';
      rankEn = 'HEAVY SNOW';
      mainTag = '水分多め';
      tags.push('重め新雪');
    } else {
      score = 78;
      rank = 'ちょいパウ';
      rankEn = 'LIGHT POWDER';
      mainTag = isBc ? 'うっすら新雪・下地注意' : '下地注意';
      tags.push(isBc ? '面選び重要' : 'トラック消えかけ');
    }
  }
  // 6. うっすら新雪（直近12h降雪 1〜9cm）
  else if (recentSnowfall >= 1) {
    if (isMeltedAndFrozen) {
      score = 50;
      rank = isBc ? '硬雪・クラスト' : 'しまり雪';
      rankEn = 'HARD BASE';
      mainTag = isBc ? '硬雪・滑落注意' : 'スリップ注意';
      tags.push('下層硬め', isBc ? 'クトー・アイゼン要' : 'エッジ必須');
    } else {
      score = 72;
      rank = isBc ? '山岳しまり雪' : 'しまり雪';
      rankEn = 'LIGHT FRESH';
      mainTag = 'うっすら化粧雪';
      tags.push('下地パック雪');
    }
  }
  // 7. 新雪なし（1cm未満）
  else {
    if (isMeltedAndFrozen && currentTemp <= 0.0) {
      score = 30;
      rank = isBc ? 'アイス・クラスト' : 'アイスバーン';
      rankEn = 'ICE/HARD';
      mainTag = isBc ? 'クラスト・滑落警戒' : '下層ガリガリ';
      tags.push(isBc ? 'アイゼン推奨' : 'エッジ注意', '滑落警戒');
    } else if (currentTemp >= 2.0) {
      score = 55;
      rank = 'ザラメ雪';
      rankEn = 'SPRING/SLUSH';
      mainTag = isBc ? '春ザラメ・グライド注意' : 'シャバ雪';
      tags.push('春雪', isBc ? '全層雪崩注意' : 'ワックス要');
    } else {
      score = 75;
      rank = isBc ? '安定しまり雪' : 'しまり雪';
      rankEn = 'PACKED';
      mainTag = isBc ? '山岳しまり雪' : '良好グリップ';
      tags.push(isBc ? '行動しやすい' : 'スピード爽快');
    }
  }

  // 6. 風速による補正
  if (currentWind >= 12) {
    score -= isBc ? 15 : 10;
    tags.push(isBc ? 'ウインドパック・風成雪' : '強風・風パック', '地吹雪注意');
  }

  // 7. 積雪深が浅い場合の安全注意（BCは100cm未満、スキー場は50cm未満）
  if (isBc && currentSnowDepth < 100) {
    score -= 15;
    tags.push('積雪100cm未満', '薮・地形露出注意');
  } else if (!isBc && currentSnowDepth < 50) {
    score -= 10;
    tags.push('積雪浅め', 'ブッシュ注意');
  }

  // 8. BC専用の山岳リスク判定と安全スコア上限
  let bcAlert = null;
  if (isBc) {
    bcAlert = evaluateBcAlert({
      currentSnowDepth,
      currentTemp,
      currentWind,
      isRain,
      recentSnowfall,
      snow24h,
      tempRise24h,
      isMeltedAndFrozen
    });
    if (bcAlert.level === 'HIGH') {
      score = Math.min(score, 45);
    } else if (bcAlert.level === 'MODERATE') {
      score = Math.min(score, 75);
    }
  }

  score = Math.max(10, Math.min(99, score));

  return { score, rank, rankEn, tag: mainTag, tags, bcAlert };
}

async function fetchWithRetry(url, maxRetries = 6) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        console.warn(`\n[Open-Meteo 429 Rate Limit] 15秒待機後に再試行 (${attempt}/${maxRetries})...`);
        await sleep(15000);
        continue;
      }
      const data = await res.json();
      if (data && data.error && (data.reason || '').includes('limit exceeded')) {
        console.warn(`\n[Open-Meteo Limit Exceeded] 15秒待機後に再試行 (${attempt}/${maxRetries})...`);
        await sleep(15000);
        continue;
      }
      return data;
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await sleep(3000);
    }
  }
  throw new Error(`Failed to fetch after ${maxRetries} retries: ${url}`);
}

async function run() {
  console.log('=== SNOW BASE 2地点独立座標バッチ開始 ===');
  const startTime = Date.now();

  const spotsFile = path.join(__dirname, '..', 'spot_rules_japan.json');
  const spots = JSON.parse(fs.readFileSync(spotsFile, 'utf8'));
  console.log(`対象スポット総数: ${spots.length}`);

  const outputPath = path.join(__dirname, '..', 'data_japan.json');
  const existingSpotsMap = {};
  try {
    if (fs.existsSync(outputPath)) {
      const oldData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      if (Array.isArray(oldData.spots)) {
        oldData.spots.forEach(s => { existingSpotsMap[s.id] = s; });
        console.log(`既存キャッシュロード成功: ${oldData.spots.length}件`);
      }
    }
  } catch (e) {
    console.warn('既存キャッシュ読み込みスキップ:', e.message);
  }

  // 1. 気象庁アメダス最新データ取得 (最新10分値 + 毎正時積雪値)
  let amedasMap = {};
  let amedasSnowMap = {};
  let latestJmaTime = '';
  let latestSnowTime = '';
  try {
    const timeRes = await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt');
    const timeText = (await timeRes.text()).trim();
    latestJmaTime = timeText;
    const timeStr = timeText.replace(/[-:T\+]/g, '').slice(0, 14);
    const jmaUrl = `https://www.jma.go.jp/bosai/amedas/data/map/${timeStr}.json`;
    console.log(`気象庁アメダス最新JSON取得中: ${timeText}`);
    const jmaRes = await fetch(jmaUrl);
    if (jmaRes.ok) {
      amedasMap = await jmaRes.json();
      console.log(`気象庁観測所データ取得成功: ${Object.keys(amedasMap).length} 観測点`);
    }

    // 積雪データは毎正時 (XX:00:00) に配信されるため、直近の正時JSONを取得
    const jmaDate = new Date(timeText);
    const jmaMinute = jmaDate.getMinutes();
    const snowDate = new Date(jmaDate);
    snowDate.setMinutes(0, 0, 0);
    // 正時直後 (00〜05分等) はデータ生成遅延がある場合があるため、取得失敗時は1時間前へフォールバック
    const formatTimeStr = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}0000`;
    };

    let snowTimeStr = formatTimeStr(snowDate);
    let snowRes = await fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${snowTimeStr}.json`);
    if (!snowRes.ok) {
      // 1時間前へフォールバック
      const prevHourDate = new Date(snowDate.getTime() - 3600000);
      snowTimeStr = formatTimeStr(prevHourDate);
      snowRes = await fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${snowTimeStr}.json`);
    }

    if (snowRes.ok) {
      amedasSnowMap = await snowRes.json();
      latestSnowTime = `${snowTimeStr.slice(0, 4)}-${snowTimeStr.slice(4, 6)}-${snowTimeStr.slice(6, 8)}T${snowTimeStr.slice(8, 10)}:00:00+09:00`;
      console.log(`気象庁アメダス正時積雪データ取得成功: ${snowTimeStr} (${Object.keys(amedasSnowMap).length} 観測点)`);
    } else {
      console.warn('気象庁アメダス正時積雪JSON取得失敗');
    }
  } catch (err) {
    console.warn('気象庁アメダス取得エラー:', err.message);
  }

  // 2. Open-Meteo Multi-location 一括取得
  // 山頂用（top.lat, top.lon, top.elevation）と山麓用（base.lat, base.lon, base.elevation）を完全分離取得
  const BATCH_SIZE = 25;
  const processedSpots = [];

  for (let i = 0; i < spots.length; i += BATCH_SIZE) {
    const chunk = spots.slice(i, i + BATCH_SIZE);
    process.stdout.write(`Open-Meteo 進捗: ${Math.min(i + BATCH_SIZE, spots.length)} / ${spots.length}\r`);

    // 山頂用独立パラメータ
    const topLats = chunk.map(s => s.top.lat).join(',');
    const topLons = chunk.map(s => s.top.lon).join(',');
    const topElevs = chunk.map(s => s.top.elevation).join(',');

    // 山麓用独立パラメータ
    const baseLats = chunk.map(s => s.base.lat).join(',');
    const baseLons = chunk.map(s => s.base.lon).join(',');
    const baseElevs = chunk.map(s => s.base.elevation).join(',');

    const queryParams = 'hourly=temperature_2m,snowfall,snow_depth,weather_code,wind_speed_10m,wind_direction_10m,precipitation,rain&timezone=Asia%2FTokyo&forecast_days=7&past_days=1';

    const urlTop = `https://api.open-meteo.com/v1/forecast?latitude=${topLats}&longitude=${topLons}&elevation=${topElevs}&${queryParams}`;
    const urlBase = `https://api.open-meteo.com/v1/forecast?latitude=${baseLats}&longitude=${baseLons}&elevation=${baseElevs}&${queryParams}`;

    try {
      const [resTop, resBase] = await Promise.all([
        fetchWithRetry(urlTop),
        fetchWithRetry(urlBase)
      ]);

      const topList = Array.isArray(resTop) ? resTop : [resTop];
      const baseList = Array.isArray(resBase) ? resBase : [resBase];

      for (let j = 0; j < chunk.length; j++) {
        const spot = chunk[j];
        const topData = topList[j];
        const baseData = baseList[j];

        if (!topData || !topData.hourly) continue;

        const jstNow = new Date(Date.now() + 9 * 3600000);
        const currentHourStr = jstNow.toISOString().slice(0, 13);
        let currentIdx = 24;
        for (let idx = 0; idx < topData.hourly.time.length; idx++) {
          if (topData.hourly.time[idx].startsWith(currentHourStr)) {
            currentIdx = idx;
            break;
          }
        }

        const evaluation = evaluateSnowCondition(topData.hourly, currentIdx, spot.category || 'ski');

        // 夜間降雪量 (18:00〜翌朝06:00)
        const nightSnowByDate = {};
        const times = topData.hourly.time;
        for (let tIdx = 0; tIdx < times.length; tIdx++) {
          const tStr = times[tIdx];
          if (tStr.endsWith('06:00')) {
            let sumNight = 0;
            const startNight = Math.max(0, tIdx - 12);
            for (let k = startNight; k < tIdx; k++) {
              sumNight += (topData.hourly.snowfall[k] || 0);
            }
            nightSnowByDate[tStr] = Math.round(sumNight * 10) / 10;
          }
        }

        // 7日間のデイリーサマリー（今日から7日間）
        const dailySummary = [];
        const seenDates = new Set();
        const todayDateStr = jstNow.toISOString().slice(0, 10);
        for (let dIdx = 0; dIdx < times.length; dIdx++) {
          const dateStr = times[dIdx].slice(0, 10);
          if (dateStr < todayDateStr) continue; // 過去日は除外して今日から7日間
          if (seenDates.has(dateStr)) continue;
          seenDates.add(dateStr);

          let maxTemp = -999;
          let minTemp = 999;
          let sumSnow = 0;
          let maxHourlySnow = 0;
          let repWind = null;
          let representativeCode = 0;
          for (let k = 0; k < times.length; k++) {
            if (times[k].startsWith(dateStr)) {
              const t = topData.hourly.temperature_2m[k];
              if (t > maxTemp) maxTemp = t;
              if (t < minTemp) minTemp = t;
              const sf = topData.hourly.snowfall[k] || 0;
              sumSnow += sf;
              if (sf > maxHourlySnow) maxHourlySnow = sf;
              if (times[k].endsWith('12:00')) {
                representativeCode = topData.hourly.weather_code[k];
                repWind = topData.hourly.wind_speed_10m ? topData.hourly.wind_speed_10m[k] : null;
              }
            }
          }

          const weather = getWeatherInfo(representativeCode, maxHourlySnow > 0 ? maxHourlySnow : null, repWind);
          dailySummary.push({
            date: dateStr,
            weatherCode: representativeCode,
            weatherLabel: weather.label,
            weatherIcon: weather.icon,
            maxTemp: Math.round(maxTemp),
            minTemp: Math.round(minTemp),
            totalSnowfall: Math.round(sumSnow * 10) / 10
          });
        }

        let liveAmedas = null;
        if (spot.amedasId) {
          const raw = amedasMap[spot.amedasId];
          const rawSnow = amedasSnowMap[spot.amedasId];
          if (raw || rawSnow) {
            liveAmedas = {
              source: 'jma_amedas',
              stationId: spot.amedasId,
              stationName: spot.amedasName,
              snowDepth: (rawSnow && rawSnow.snow && rawSnow.snow[0] !== null) ? rawSnow.snow[0] : (raw && raw.snow && raw.snow[0] !== null ? raw.snow[0] : null),
              snow1h: rawSnow && rawSnow.snow1h ? rawSnow.snow1h[0] : null,
              snow6h: rawSnow && rawSnow.snow6h ? rawSnow.snow6h[0] : null,
              snow12h: rawSnow && rawSnow.snow12h ? rawSnow.snow12h[0] : null,
              snow24h: rawSnow && rawSnow.snow24h ? rawSnow.snow24h[0] : null,
              temp: raw && raw.temp ? raw.temp[0] : (rawSnow && rawSnow.temp ? rawSnow.temp[0] : null),
              precipitation1h: raw && raw.precipitation1h ? raw.precipitation1h[0] : (rawSnow && rawSnow.precipitation1h ? rawSnow.precipitation1h[0] : 0),
              windSpeed: raw && raw.wind ? raw.wind[0] : (rawSnow && rawSnow.wind ? rawSnow.wind[0] : null),
              updatedAt: latestJmaTime,
              snowUpdatedAt: latestSnowTime || latestJmaTime
            };
          }
        }

        const start6h = Math.max(0, currentIdx - 5);
        const snow6h = Math.round(topData.hourly.snowfall.slice(start6h, currentIdx + 1).reduce((acc, v) => acc + (v || 0), 0) * 10) / 10;

        const start24h = Math.max(0, currentIdx - 23);
        const snow24h = Math.round(topData.hourly.snowfall.slice(start24h, currentIdx + 1).reduce((acc, v) => acc + (v || 0), 0) * 10) / 10;

        processedSpots.push({
          ...spot,
          current: {
            topSnowDepth: Math.round((topData.hourly.snow_depth[currentIdx] || 0) * 100),
            baseSnowDepth: Math.round((baseData.hourly.snow_depth[currentIdx] || 0) * 100),
            topTemp: Math.round(topData.hourly.temperature_2m[currentIdx] * 10) / 10,
            baseTemp: Math.round(baseData.hourly.temperature_2m[currentIdx] * 10) / 10,
            windSpeed: Math.round(topData.hourly.wind_speed_10m[currentIdx] * 10) / 10,
            windDirection: topData.hourly.wind_direction_10m ? topData.hourly.wind_direction_10m[currentIdx] : null,
            windDirText: getWindDirDisplay(topData.hourly.wind_direction_10m ? topData.hourly.wind_direction_10m[currentIdx] : null),
            weatherCode: topData.hourly.weather_code[currentIdx],
            weatherInfo: getWeatherInfo(
              topData.hourly.weather_code[currentIdx],
              topData.hourly.snowfall ? topData.hourly.snowfall[currentIdx] : null,
              topData.hourly.wind_speed_10m ? topData.hourly.wind_speed_10m[currentIdx] : null
            ),
            snow6h,
            snow24h,
            score: evaluation.score,
            rank: evaluation.rank,
            rankEn: evaluation.rankEn,
            tag: evaluation.tag,
            tags: evaluation.tags,
            bcAlert: evaluation.bcAlert || null,
            liveAmedas
          },
          nightSnowByDate,
          dailySummary: dailySummary.slice(0, 7),
          topHourly: {
            time: topData.hourly.time,
            temperature: topData.hourly.temperature_2m,
            snowfall: topData.hourly.snowfall,
            snowDepth: topData.hourly.snow_depth.map(v => Math.round((v || 0) * 100)),
            rain: topData.hourly.rain || [],
            weatherCode: topData.hourly.weather_code,
            windSpeed: topData.hourly.wind_speed_10m,
            windDirection: topData.hourly.wind_direction_10m
          },
          baseHourly: {
            time: baseData.hourly.time,
            temperature: baseData.hourly.temperature_2m,
            snowfall: baseData.hourly.snowfall,
            snowDepth: baseData.hourly.snow_depth.map(v => Math.round((v || 0) * 100)),
            rain: baseData.hourly.rain || [],
            weatherCode: baseData.hourly.weather_code,
            windSpeed: baseData.hourly.wind_speed_10m,
            windDirection: baseData.hourly.wind_direction_10m
          }
        });
      }
    } catch (err) {
      console.error(`バッチエラー (Index ${i}):`, err.message);
      // API一時失敗時は既存キャッシュから復元してスポット欠落を防止
      chunk.forEach(s => {
        if (existingSpotsMap[s.id]) {
          processedSpots.push(existingSpotsMap[s.id]);
        }
      });
    }

    await sleep(600);
  }

  console.log(`\n全スポット集計完了: ${processedSpots.length} 件`);

  // 防御チェック: 1392件中極端に少ない場合はファイル破損を防ぐため上書きしない
  if (processedSpots.length < spots.length * 0.8) {
    throw new Error(`[ABORT] 集計スポット数が異常です (${processedSpots.length} / ${spots.length})。data_japan.json の上書きを中止しました。`);
  }

  const jstNow = new Date(Date.now() + 9 * 3600000);
  const jstHour = jstNow.getUTCHours();
  const targetMorning = new Date(jstNow.getTime() + (jstHour >= 12 ? 24 * 3600000 : 0));
  const target06Str = `${targetMorning.toISOString().slice(0, 10)}T06:00`;

  function getLatestNightSnow(nightSnowByDate) {
    if (!nightSnowByDate) return 0;
    if (nightSnowByDate[target06Str] !== undefined) return nightSnowByDate[target06Str];
    const keys = Object.keys(nightSnowByDate);
    if (keys.length === 0) return 0;
    const upcoming = keys.filter(k => k >= target06Str);
    if (upcoming.length > 0) return nightSnowByDate[upcoming[0]];
    return nightSnowByDate[keys[keys.length - 1]] || 0;
  }

  // 1. オーバーナイトスノーランキング (直近18:00〜翌朝06:00の降雪量)
  const rankingNight = [...processedSpots].map(s => {
    const nightSnow = getLatestNightSnow(s.nightSnowByDate);
    let tag = '降雪なし';
    if (nightSnow >= 80) tag = '腰パウ';
    else if (nightSnow >= 50) tag = 'モモパウ';
    else if (nightSnow >= 30) tag = 'ヒザパウ';
    else if (nightSnow >= 20) tag = 'スネパウ';
    else if (nightSnow >= 10) tag = 'くるぶしパウ';
    else if (nightSnow >= 1) tag = 'うっすら新雪';

    return {
      id: s.id,
      name: s.name,
      category: s.category,
      regionName: s.regionName,
      areaName: s.areaName,
      snow: nightSnow,
      depth: s.current.topSnowDepth,
      score: s.current.score,
      tag,
      isReset: nightSnow >= 20
    };
  }).sort((a, b) => b.snow - a.snow).slice(0, 25);

  // 2. 6時間速報ランキング
  const ranking6h = [...processedSpots].sort((a, b) => (b.current.snow6h || 0) - (a.current.snow6h || 0)).slice(0, 25).map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    regionName: s.regionName,
    areaName: s.areaName,
    snow: s.current.snow6h || 0,
    depth: s.current.topSnowDepth,
    score: s.current.score,
    tag: s.current.tag
  }));

  // 3. 24時間累積ランキング
  const ranking24h = [...processedSpots].sort((a, b) => (b.current.snow24h || 0) - (a.current.snow24h || 0)).slice(0, 25).map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    regionName: s.regionName,
    areaName: s.areaName,
    snow: s.current.snow24h || 0,
    depth: s.current.topSnowDepth,
    score: s.current.score,
    tag: s.current.tag
  }));

  // 重複する time 配列を sharedTime に共通化してファイルサイズを大幅削減
  let sharedTime = null;
  for (const sp of processedSpots) {
    if (sp.topHourly && Array.isArray(sp.topHourly.time)) {
      if (!sharedTime) sharedTime = sp.topHourly.time;
      if (JSON.stringify(sp.topHourly.time) === JSON.stringify(sharedTime)) {
        delete sp.topHourly.time;
      }
    }
    if (sp.baseHourly && Array.isArray(sp.baseHourly.time)) {
      if (!sharedTime) sharedTime = sp.baseHourly.time;
      if (JSON.stringify(sp.baseHourly.time) === JSON.stringify(sharedTime)) {
        delete sp.baseHourly.time;
      }
    }
  }

  const outputData = {
    updatedAt: new Date().toISOString(),
    spotsCount: processedSpots.length,
    sharedTime,
    rankingNight,
    ranking6h,
    ranking24h,
    spots: processedSpots
  };

  fs.writeFileSync(outputPath, JSON.stringify(outputData), 'utf8');

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`=== バッチ完了！出力先: ${outputPath} (${processedSpots.length}スポット集計, 処理時間: ${elapsedSec}秒) ===`);
}

run().catch(console.error);
