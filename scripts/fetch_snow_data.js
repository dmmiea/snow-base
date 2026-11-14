const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getWeatherInfo(code) {
  if (code === 0) return { label: '快晴', icon: '☀️' };
  if (code === 1 || code === 2) return { label: '晴れ/薄曇', icon: '🌤️' };
  if (code === 3) return { label: '曇り', icon: '☁️' };
  if (code === 45 || code === 48) return { label: '霧/濃霧', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: '霧雨', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { label: '雨', icon: '🌧️' };
  if (code >= 71 && code <= 75) return { label: '雪', icon: '❄️' };
  if (code === 77) return { label: '雪粒', icon: '🌨️' };
  if (code >= 80 && code <= 82) return { label: 'にわか雨', icon: '🌦️' };
  if (code === 85 || code === 86) return { label: 'にわか雪', icon: '🌨️' };
  if (code >= 95) return { label: '雷雨/吹雪', icon: '⛈️' };
  return { label: '雪', icon: '❄️' };
}

function evaluateSnowCondition(hourlyData, currentHourIndex) {
  if (!hourlyData || !hourlyData.time || currentHourIndex < 0) {
    return { score: null, rank: '積雪なし', rankEn: 'NO SNOW', tag: '🌱 積雪なし (滑走不可)', tags: ['積雪ゼロ', '滑走不可'] };
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
      tag: '🌱 積雪不足 (滑走不可)',
      tags: ['積雪30cm未満', '滑走不可', 'ブッシュ・石注意']
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

  // 直近12時間の新雪量
  let recentSnowfall = 0;
  const recentStart = Math.max(0, currentHourIndex - 12);
  for (let i = recentStart; i <= currentHourIndex; i++) {
    recentSnowfall += (snowfallArr[i] || 0);
  }

  const currentTemp = tempArr[currentHourIndex];
  const currentWind = windArr[currentHourIndex];
  const weatherCode = weatherArr[currentHourIndex];

  let score = 75;
  let rank = 'しまり雪';
  let rankEn = 'PACKED';
  let mainTag = '⛷️ 上質しまり雪';
  const tags = [];

  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isMeltedAndFrozen = freezePointIdx >= 0 && snowAfterFreeze < 30;

  // 2. 雨天・急激融雪判定
  if (isRain || currentTemp >= 6.0) {
    score = 25;
    rank = '雨・ウェット';
    rankEn = 'WET/RAIN';
    mainTag = '🌧️ 雨・ウェット (融雪注意)';
    tags.push('雨天', '雪面悪化', '防水必須');
  }
  // 3. 本格ディープパウダー判定（直近12h降雪 >= 30cm）底付きなし黄金ゾーン
  else if (recentSnowfall >= 30) {
    if (currentTemp <= -6.0) {
      score = 95;
      rank = '神パウ';
      rankEn = 'DEEP POWDER';
      mainTag = '❄️ 極上ドライパウダー';
      tags.push('極上シルキー', '浮遊感', '底付きなし');
    } else if (currentTemp >= -0.5) {
      score = 75;
      rank = '重パウ';
      rankEn = 'HEAVY POWDER';
      mainTag = '🌨️ 湿雪・ディープ重パウ';
      tags.push('湿雪', '重め', '浮遊感あり');
    } else {
      score = 90;
      rank = '極上パウ';
      rankEn = 'DEEP POWDER';
      mainTag = '❄️ ディープパウダー (底付きなし)';
      tags.push('浮遊感', '底付きなし', 'パウダー');
    }
  }
  // 4. スネパウ / 新雪リセット判定（直近12h降雪 20〜29cm）
  else if (recentSnowfall >= 20) {
    if (isMeltedAndFrozen && snowAfterFreeze < 25) {
      score = 75;
      rank = '底付き注意';
      rankEn = 'CRUST BASE';
      mainTag = '⚠️ 新雪パウダー (下層硬め・底付き注意)';
      tags.push('底付き注意', '下層クラスト', '新雪あり');
    } else if (currentTemp >= -0.5) {
      score = 70;
      rank = '重パウ';
      rankEn = 'HEAVY POWDER';
      mainTag = '🌨️ 湿雪・重パウ (水分多め)';
      tags.push('湿雪', '重め', '新雪あり');
    } else if (currentTemp <= -6.0) {
      score = 90;
      rank = '極上パウ';
      rankEn = 'DRY POWDER';
      mainTag = '❄️ 極上ドライパウダー (面ツル)';
      tags.push('極上シルキー', '浮遊感', '面ツルリセット');
    } else {
      score = 85;
      rank = '良質パウ';
      rankEn = 'FRESH SNOW';
      mainTag = '❄️ 新雪パウダー (面ツルリセット)';
      tags.push('パウダー', '面ツルリセット', '浮遊感あり');
    }
  }
  // 5. ちょいパウ / スネ下判定（直近12h降雪 10〜19cm）
  else if (recentSnowfall >= 10) {
    if (isMeltedAndFrozen) {
      score = 68;
      rank = '底付き注意';
      rankEn = 'CRUST BASE';
      mainTag = '⚠️ 底付きパウダー (下層硬め)';
      tags.push('底付き注意', '下層クラスト', '新雪あり');
    } else if (currentTemp >= -0.5) {
      score = 65;
      rank = '重め新雪';
      rankEn = 'HEAVY SNOW';
      mainTag = '🌨️ 湿雪・ちょいパウ';
      tags.push('湿雪', 'ちょいパウ');
    } else {
      score = 78;
      rank = 'ちょいパウ';
      rankEn = 'LIGHT POWDER';
      mainTag = '❄️ ライトパウダー (下地注意)';
      tags.push('ちょいパウ', 'トラック消えかけ');
    }
  }
  // 6. うっすら新雪（直近12h降雪 1〜9cm）
  else if (recentSnowfall >= 1) {
    if (isMeltedAndFrozen) {
      score = 50;
      rank = 'カリカリ新雪';
      rankEn = 'HARD BASE';
      mainTag = 'うっすら新雪 (下層硬め)';
      tags.push('スリップ注意', 'エッジ必須');
    } else {
      score = 72;
      rank = '良質新雪';
      rankEn = 'LIGHT FRESH';
      mainTag = 'うっすら新雪';
      tags.push('うっすら新雪', 'パック雪');
    }
  }
  // 7. 新雪なし（1cm未満）
  else {
    if (isMeltedAndFrozen && currentTemp <= 0.0) {
      score = 30;
      rank = 'アイスバーン';
      rankEn = 'ICE/HARD';
      mainTag = '🧊 凍結アイスバーン (未解消)';
      tags.push('下層ガリガリ', 'エッジ注意', '滑落警戒');
    } else if (currentTemp >= 2.0) {
      score = 55;
      rank = 'ザラメ';
      rankEn = 'SPRING/SLUSH';
      mainTag = '☀️ ザラメ / シャバ雪';
      tags.push('ザラメ雪', 'シャバ雪', 'ワックス要');
    } else {
      score = 75;
      rank = 'しまり雪';
      rankEn = 'PACKED';
      mainTag = '⛷️ 上質しまり雪';
      tags.push('しまり雪', 'グリップ良好', 'スピード爽快');
    }
  }

  // 6. 風速による補正
  if (currentWind >= 12) {
    score -= 10;
    tags.push('強風・風パック', '地吹雪注意');
  }

  // 7. 積雪深が浅い場合（30〜49cm）の安全注意
  if (currentSnowDepth < 50) {
    score -= 10;
    tags.push('積雪浅め', 'ブッシュ・小石注意');
  }

  score = Math.max(10, Math.min(99, score));

  return { score, rank, rankEn, tag: mainTag, tags };
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

  // 1. 気象庁アメダス最新データ取得
  let amedasMap = {};
  let latestJmaTime = '';
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

    const queryParams = 'hourly=temperature_2m,snowfall,snow_depth,weather_code,wind_speed_10m,wind_direction_10m,precipitation&timezone=Asia%2FTokyo&forecast_days=7&past_days=1';

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

        const evaluation = evaluateSnowCondition(topData.hourly, currentIdx);

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
          let representativeCode = 0;
          for (let k = 0; k < times.length; k++) {
            if (times[k].startsWith(dateStr)) {
              const t = topData.hourly.temperature_2m[k];
              if (t > maxTemp) maxTemp = t;
              if (t < minTemp) minTemp = t;
              sumSnow += (topData.hourly.snowfall[k] || 0);
              if (times[k].endsWith('12:00')) {
                representativeCode = topData.hourly.weather_code[k];
              }
            }
          }

          const weather = getWeatherInfo(representativeCode);
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
        if (spot.amedasId && amedasMap[spot.amedasId]) {
          const raw = amedasMap[spot.amedasId];
          liveAmedas = {
            stationId: spot.amedasId,
            stationName: spot.amedasName,
            snowDepth: raw.snow ? raw.snow[0] : null,
            temp: raw.temp ? raw.temp[0] : null,
            precipitation1h: raw.precipitation1h ? raw.precipitation1h[0] : 0,
            windSpeed: raw.wind ? raw.wind[0] : null,
            updatedAt: latestJmaTime
          };
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
            weatherCode: topData.hourly.weather_code[currentIdx],
            weatherInfo: getWeatherInfo(topData.hourly.weather_code[currentIdx]),
            snow6h,
            snow24h,
            score: evaluation.score,
            rank: evaluation.rank,
            rankEn: evaluation.rankEn,
            tag: evaluation.tag,
            tags: evaluation.tags,
            liveAmedas
          },
          nightSnowByDate,
          dailySummary: dailySummary.slice(0, 7),
          topHourly: {
            time: topData.hourly.time,
            temperature: topData.hourly.temperature_2m,
            snowfall: topData.hourly.snowfall,
            snowDepth: topData.hourly.snow_depth.map(v => Math.round((v || 0) * 100)),
            weatherCode: topData.hourly.weather_code,
            windSpeed: topData.hourly.wind_speed_10m,
            windDirection: topData.hourly.wind_direction_10m
          },
          baseHourly: {
            time: baseData.hourly.time,
            temperature: baseData.hourly.temperature_2m,
            snowfall: baseData.hourly.snowfall,
            snowDepth: baseData.hourly.snow_depth.map(v => Math.round((v || 0) * 100)),
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
    if (nightSnow >= 80) tag = '腰パウ🔥';
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

  const outputData = {
    updatedAt: new Date().toISOString(),
    spotsCount: processedSpots.length,
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
