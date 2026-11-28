// POWDER BASE JAPAN Service Worker (Cache & Offline Support v30)
const CACHE_NAME = 'powder-base-v30';

const STATIC_ASSETS = [
  './',
  './i18n.js',
  './manifest.json',
  './icons/apple-touch-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Old Cache Cleanup)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // 1. data_japan.json は大容量(~10MB)のためSWキャッシュを通さず直接ネットワークから取得（iOS容量制限・破損対策）
  if (url.pathname.endsWith('data_japan.json')) {
    return;
  }

  // spot_rules_japan.json: Network-First
  if (url.pathname.endsWith('spot_rules_japan.json')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[SW] Network failed, serving cached snow data:', request.url);
          return caches.match(request);
        })
    );
    return;
  }

  // 2. ルートナビゲーション (HTML / App Shell) & i18n / snow_map: Network-First with Cache Fallback
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('index.html') || url.pathname.endsWith('snow_map.html') || url.pathname.endsWith('i18n.js') || url.pathname.endsWith('en_names.json')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. 静的アセット・外部ライブラリ (CDN/CSS/JS/Icons): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && (request.url.startsWith('http') || request.url.startsWith('https'))) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ===============================
// プッシュ通知受信ハンドラ（iOS 16.4+ / Android / PC 対応）
// ===============================
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'POWDER BASE 雪情報', body: event.data.text() };
    }
  }

  const title = data.title || 'POWDER BASE 雪情報';
  const options = {
    body: data.body || '新しいパウダー・降雪アラートが届きました！',
    icon: data.icon || 'icons/icon-192.png',
    badge: data.badge || 'icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './#feed',
      spotId: data.spotId || null,
      targetTab: data.targetTab || 'feed'
    },
    tag: data.tag || 'powder-base-alert',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ===============================
// 通知タップ時の挙動ハンドラ
// ===============================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notifData = event.notification.data || {};
  let targetUrl = notifData.url || './#feed';

  // オープンリダイレクト防御（同一オリジンのみ許可）
  try {
    const parsed = new URL(targetUrl, self.location.origin);
    if (parsed.origin !== self.location.origin) {
      targetUrl = './#feed';
    } else {
      targetUrl = parsed.href;
    }
  } catch (_) {
    targetUrl = './#feed';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({ action: 'OPEN_TAB', tab: notifData.targetTab || 'feed' });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
