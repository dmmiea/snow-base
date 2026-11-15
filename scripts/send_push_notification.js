/**
 * POWDER BASE JAPAN - Web Push Notification Engine
 * ・朝(06-09時): MYスポットで今朝の夜間新雪がしきい値以上の時だけ通知
 * ・夜(17-21時): 明朝の夜間新雪、または3日以内にしきい値以上の降雪予報がある時だけ通知
 * ・週末予想(木・金 17-21時): 土日のいずれかにしきい値以上の降雪予報がある週末だけ週1回通知
 * ・AI全国パウダー大賞: MYスポット以外で全国トップ級(+20cm以上)が出現した日のみ添える
 */

const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

console.log('=== POWDER BASE: Push Notification Engine Starting ===');

// 1. VAPIDキー読み込み
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  const vapidPath = path.join(__dirname, '..', 'vapid_keys.json');
  if (fs.existsSync(vapidPath)) {
    try {
      const vapidKeys = JSON.parse(fs.readFileSync(vapidPath, 'utf8'));
      vapidPublicKey = vapidKeys.publicKey;
      vapidPrivateKey = vapidKeys.privateKey;
    } catch (e) {}
  }
}

const isDryRun = process.argv.includes('--dry-run');

if ((!vapidPublicKey || !vapidPrivateKey) && !isDryRun) {
  console.log('No VAPID keys configured (env or vapid_keys.json). Skipping push notification.');
  process.exit(0);
}

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:powderbase-notify@example.com',
    vapidPublicKey,
    vapidPrivateKey
  );
}

// 2. Firebase Firestore REST 設定
const FIREBASE_PROJECT_ID = 'surf-base-133da';
const FIRESTORE_COLLECTION = 'snow_push_subscriptions';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${FIRESTORE_COLLECTION}`;

function parseFirestoreValue(val) {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(parseFirestoreValue);
  }
  return null;
}

async function fetchSubscribersFromFirestore() {
  const subscribers = [];
  let pageToken = '';
  try {
    do {
      const url = `${FIRESTORE_BASE_URL}?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[Firestore] Fetch failed: ${res.status}`);
        break;
      }
      const json = await res.json();
      const docs = json.documents || [];
      for (const doc of docs) {
        const f = doc.fields || {};
        const endpoint = parseFirestoreValue(f.endpoint);
        const p256dh = parseFirestoreValue(f.p256dh);
        const auth = parseFirestoreValue(f.auth);
        if (!endpoint || !p256dh || !auth) continue;
        subscribers.push({
          docName: doc.name,
          docId: doc.name.split('/').pop(),
          endpoint,
          p256dh,
          auth,
          threshold_cm: parseFirestoreValue(f.threshold_cm) ?? 10,
          timing_morning: parseFirestoreValue(f.timing_morning) !== false,
          timing_evening: parseFirestoreValue(f.timing_evening) !== false,
          timing_weekend: parseFirestoreValue(f.timing_weekend) !== false,
          auto_pickup: parseFirestoreValue(f.auto_pickup) !== false,
          fav_spots: parseFirestoreValue(f.fav_spots) || []
        });
      }
      pageToken = json.nextPageToken || '';
    } while (pageToken);
    console.log(`[Firestore] Loaded ${subscribers.length} subscribers.`);
  } catch (e) {
    console.warn('[Firestore] Error loading subscribers:', e.message);
  }
  return subscribers;
}

async function removeExpiredSubscription(docName) {
  try {
    await fetch(`https://firestore.googleapis.com/v1/${docName}`, { method: 'DELETE' });
    console.log(`[Firestore] Removed expired subscription: ${docName.split('/').pop()}`);
  } catch (e) {}
}

// 3. JST 日時ユーティリティ
function getJstInfo() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = fmt.formatToParts(now);
  const get = (type) => parts.find(p => p.type === type)?.value || '00';
  const y = Number(get('year'));
  const m = Number(get('month'));
  const d = Number(get('day'));
  const hour = Number(get('hour'));
  const min = Number(get('minute'));

  const baseUtc = Date.UTC(y, m - 1, d);
  const addDaysISO = (days) => {
    const dt = new Date(baseUtc + days * 86400000);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };
  const dayOfWeek = new Date(baseUtc).getUTCDay(); // 0=日, 1=月, ..., 4=木, 5=金, 6=土

  // 直近の土日ISO日付（木曜=+2,+3 / 金曜=+1,+2）
  const daysToSat = (6 - dayOfWeek + 7) % 7;
  const satISO = addDaysISO(daysToSat === 0 ? 0 : daysToSat);
  const sunISO = addDaysISO((daysToSat === 0 ? 0 : daysToSat) + 1);

  return {
    y, m, d, hour, min, dayOfWeek,
    todayISO: addDaysISO(0),
    tomorrowISO: addDaysISO(1),
    day2ISO: addDaysISO(2),
    day3ISO: addDaysISO(3),
    satISO,
    sunISO,
    weekKey: `${satISO}_weekend`
  };
}

function getNightSnow(spot, dateISO) {
  if (!spot || !spot.nightSnowByDate) return 0;
  return Number(spot.nightSnowByDate[`${dateISO}T06:00`] || 0);
}

function getDailySnow(spot, dateISO) {
  if (!spot || !Array.isArray(spot.dailySummary)) return 0;
  const found = spot.dailySummary.find(d => d.date === dateISO);
  return found ? Number(found.totalSnowfall || 0) : 0;
}

function formatSpotTag(spot) {
  const icon = spot.category === 'bc' ? '⛰️' : '🏂';
  if (spot.category === 'bc' && spot.current) {
    const alertLevel = spot.current.bcAlert && spot.current.bcAlert.level;
    const wind = Number(spot.current.windSpeed || 0);
    if (alertLevel === 'HIGH' || wind >= 12) {
      return `${icon}${spot.name}(⚠️強風/警戒)`;
    }
  }
  return `${icon}${spot.name}`;
}

async function run() {
  const jst = getJstInfo();

  // 履歴管理ファイル
  const historyPath = path.join(__dirname, 'notification_history.json');
  let history = { lastMorningDate: '', lastEveningDate: '', lastWeekendKey: '' };
  if (fs.existsSync(historyPath)) {
    try {
      history = { ...history, ...JSON.parse(fs.readFileSync(historyPath, 'utf8')) };
    } catch (e) {}
  }

  // モード判定
  const timingArg = process.argv.find(a => a.startsWith('--timing='));
  let timingMode = 'none';
  if (timingArg) {
    timingMode = timingArg.split('=')[1];
  } else if (jst.hour >= 6 && jst.hour <= 9 && history.lastMorningDate !== jst.todayISO) {
    timingMode = 'morning';
  } else if (jst.hour >= 17 && jst.hour <= 21 && history.lastEveningDate !== jst.todayISO) {
    timingMode = 'evening';
  }

  console.log(`JST: ${jst.todayISO} ${String(jst.hour).padStart(2, '0')}:${String(jst.min).padStart(2, '0')} (dow=${jst.dayOfWeek}) | Mode: ${timingMode}`);

  if (timingMode !== 'morning' && timingMode !== 'evening') {
    console.log('Outside notification window or already sent today. Exiting cleanly.');
    return;
  }

  // 4. 雪データ読み込み
  const dataPath = path.join(__dirname, '..', 'data_japan.json');
  if (!fs.existsSync(dataPath)) {
    console.warn('data_japan.json not found. Skipping.');
    return;
  }
  const snowData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const spotsMap = snowData.spots || {};
  const allSpots = Object.values(spotsMap);

  // 5. 購読者取得
  const subscribers = await fetchSubscribersFromFirestore();
  if (subscribers.length === 0 && !isDryRun) {
    console.log('No subscribers registered. Skipping.');
    return;
  }

  // 全国AIパウダー大賞（+20cm以上）を事前算出
  const aiBestMorning = allSpots
    .map(s => ({ spot: s, snow: Math.max(getNightSnow(s, jst.todayISO), Number(s.current?.snow6h || 0)) }))
    .filter(x => x.snow >= 20)
    .sort((a, b) => b.snow - a.snow)[0] || null;

  const aiBestTomorrow = allSpots
    .map(s => ({ spot: s, snow: getNightSnow(s, jst.tomorrowISO) }))
    .filter(x => x.snow >= 20)
    .sort((a, b) => b.snow - a.snow)[0] || null;

  const isThuOrFri = jst.dayOfWeek === 4 || jst.dayOfWeek === 5;
  const weekendNotYetSent = history.lastWeekendKey !== jst.weekKey;

  let sentCount = 0;
  let skippedNoSnowCount = 0;
  let weekendIncludedInAny = false;

  for (const sub of subscribers) {
    const threshold = Math.max(1, Number(sub.threshold_cm || 10));
    const favIds = Array.isArray(sub.fav_spots) ? sub.fav_spots : [];
    const targetSpots = favIds.map(id => spotsMap[String(id)]).filter(Boolean);

    let title = '';
    let bodyLines = [];
    let primarySpotId = null;

    if (timingMode === 'morning') {
      if (!sub.timing_morning) continue;

      const hits = targetSpots
        .map(s => ({ spot: s, snow: Math.max(getNightSnow(s, jst.todayISO), Number(s.current?.snow6h || 0)) }))
        .filter(x => x.snow >= threshold)
        .sort((a, b) => b.snow - a.snow);

      const hasAiPickup = sub.auto_pickup && aiBestMorning && !favIds.includes(String(aiBestMorning.spot.id));

      if (hits.length === 0 && !hasAiPickup) {
        skippedNoSnowCount++;
        continue;
      }

      if (hits.length > 0) {
        const top = hits[0];
        primarySpotId = top.spot.id;
        const scoreTxt = top.spot.current?.score != null ? ` (${top.spot.current.score}点)` : '';
        title = `❄️ 今朝のパウダー速報！ ${top.spot.name} +${Math.round(top.snow)}cm`;
        bodyLines.push(`🌙今朝の新雪: ${hits.slice(0, 3).map(h => `${formatSpotTag(h.spot)} +${Math.round(h.snow)}cm`).join(' / ')}${scoreTxt}`);
      } else {
        primarySpotId = aiBestMorning.spot.id;
        title = `🤖 全国パウダー速報！ ${aiBestMorning.spot.name} +${Math.round(aiBestMorning.snow)}cm`;
      }

      if (hasAiPickup && hits.length > 0) {
        bodyLines.push(`🤖全国トップ: ${aiBestMorning.spot.name} +${Math.round(aiBestMorning.snow)}cm`);
      }
    } else if (timingMode === 'evening') {
      const wantEvening = sub.timing_evening !== false;
      const wantWeekend = sub.timing_weekend !== false && isThuOrFri && weekendNotYetSent;
      if (!wantEvening && !wantWeekend) continue;

      // ① 明朝の夜間新雪予報
      const tomorrowHits = wantEvening
        ? targetSpots
            .map(s => ({ spot: s, snow: getNightSnow(s, jst.tomorrowISO) }))
            .filter(x => x.snow >= threshold)
            .sort((a, b) => b.snow - a.snow)
        : [];

      // ② 今後3日以内（明日〜3日後）の大雪予報
      const next3Days = [
        { iso: jst.tomorrowISO, label: '明日' },
        { iso: jst.day2ISO, label: '明後日' },
        { iso: jst.day3ISO, label: '3日後' }
      ];
      const futureHits = wantEvening
        ? targetSpots
            .map(s => {
              let best = { snow: 0, label: '' };
              for (const day of next3Days) {
                const amt = Math.max(getDailySnow(s, day.iso), getNightSnow(s, day.iso));
                if (amt >= threshold && amt > best.snow) {
                  best = { snow: amt, label: day.label };
                }
              }
              return { spot: s, ...best };
            })
            .filter(x => x.snow >= threshold)
            .sort((a, b) => b.snow - a.snow)
        : [];

      // ③ 週末予想（木・金夕方、土日に基準以上の降雪予報がある場合のみ）
      const weekendPool = targetSpots.length > 0 ? targetSpots : allSpots;
      const weekendHits = wantWeekend
        ? weekendPool
            .map(s => {
              const satAmt = Math.max(getDailySnow(s, jst.satISO), getNightSnow(s, jst.satISO));
              const sunAmt = Math.max(getDailySnow(s, jst.sunISO), getNightSnow(s, jst.sunISO));
              const maxWeekend = Math.max(satAmt, sunAmt);
              const bestDay = satAmt >= sunAmt ? '土曜' : '日曜';
              return { spot: s, snow: maxWeekend, bestDay };
            })
            .filter(x => x.snow >= threshold)
            .sort((a, b) => b.snow - a.snow)
        : [];

      const hasAiEvening = wantEvening && sub.auto_pickup && aiBestTomorrow && !favIds.includes(String(aiBestTomorrow.spot.id));

      if (tomorrowHits.length === 0 && futureHits.length === 0 && weekendHits.length === 0 && !hasAiEvening) {
        skippedNoSnowCount++;
        continue;
      }

      if (tomorrowHits.length > 0) {
        const top = tomorrowHits[0];
        primarySpotId = top.spot.id;
        title = `🌨️ 明朝パウダー予報！ ${top.spot.name} +${Math.round(top.snow)}cm`;
        bodyLines.push(`🌙明朝新雪: ${tomorrowHits.slice(0, 3).map(h => `${formatSpotTag(h.spot)} +${Math.round(h.snow)}cm`).join(' / ')}`);
      } else if (futureHits.length > 0) {
        const top = futureHits[0];
        primarySpotId = top.spot.id;
        title = `❄️ 3日以内に降雪予報！ ${top.spot.name} (${top.label} +${Math.round(top.snow)}cm)`;
        bodyLines.push(`📅3日以内注目: ${futureHits.slice(0, 3).map(h => `${formatSpotTag(h.spot)}(${h.label}+${Math.round(h.snow)}cm)`).join(' / ')}`);
      } else if (weekendHits.length > 0) {
        const top = weekendHits[0];
        primarySpotId = top.spot.id;
        title = `📅 週末パウダー予想！ ${top.spot.name} ${top.bestDay}+${Math.round(top.snow)}cm`;
      } else if (hasAiEvening) {
        primarySpotId = aiBestTomorrow.spot.id;
        title = `🤖 明朝全国トップ予報！ ${aiBestTomorrow.spot.name} +${Math.round(aiBestTomorrow.snow)}cm`;
      }

      if (weekendHits.length > 0) {
        weekendIncludedInAny = true;
        if (tomorrowHits.length > 0 || futureHits.length > 0) {
          bodyLines.push(`📅週末予想: ${weekendHits.slice(0, 2).map(h => `${h.spot.name}(${h.bestDay}+${Math.round(h.snow)}cm)`).join(' / ')}`);
        } else {
          bodyLines.push(`土日狙い目: ${weekendHits.slice(0, 3).map(h => `${formatSpotTag(h.spot)} ${h.bestDay}+${Math.round(h.snow)}cm`).join(' / ')}`);
        }
      }

      if (hasAiEvening && (tomorrowHits.length > 0 || futureHits.length > 0 || weekendHits.length > 0)) {
        bodyLines.push(`🤖全国注目: ${aiBestTomorrow.spot.name} 明朝+${Math.round(aiBestTomorrow.snow)}cm`);
      }
    }

    const payload = JSON.stringify({
      title,
      body: bodyLines.join('\n') || 'POWDER BASEで最新の積雪・降雪グラフをチェック！',
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      spotId: primarySpotId ? String(primarySpotId) : null,
      targetTab: 'feed',
      url: './#feed',
      tag: `powder-base-${timingMode}-${jst.todayISO}`
    });

    if (isDryRun) {
      console.log(`[DRY-RUN] Would send to ${sub.docId}: ${title} | ${bodyLines.join(' / ')}`);
      sentCount++;
      continue;
    }

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sentCount++;
    } catch (err) {
      console.warn(`[Push Error] ${sub.docId}: ${err.statusCode || err.message}`);
      if (err.statusCode === 404 || err.statusCode === 410) {
        await removeExpiredSubscription(sub.docName);
      }
    }
  }

  console.log(`Done. Sent: ${sentCount}, Skipped(below threshold): ${skippedNoSnowCount}`);

  if (!isDryRun) {
    if (timingMode === 'morning') history.lastMorningDate = jst.todayISO;
    if (timingMode === 'evening') history.lastEveningDate = jst.todayISO;
    if (weekendIncludedInAny) history.lastWeekendKey = jst.weekKey;
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  }
}

run().catch(err => {
  console.error('Fatal push engine error:', err);
  process.exit(1);
});
