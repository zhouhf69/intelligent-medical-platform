const CACHE_NAME = 'medical-record-v1';
const STATIC_ASSETS = [
  '/',
  '/login',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.method !== 'GET') return;
  
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response(
            JSON.stringify({ 
              error: 'offline',
              message: '当前处于离线状态，数据将在联网后同步' 
            }),
            { 
              headers: { 'Content-Type': 'application/json' },
              status: 503 
            }
          );
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-medical-data') {
    event.waitUntil(syncMedicalData());
  }
});

async function syncMedicalData() {
  const db = await openDB('medical-record-db', 1);
  const tx = db.transaction('outbox', 'readonly');
  const store = tx.objectStore('outbox');
  const requests = await store.getAll();
  
  for (const request of requests) {
    try {
      await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body),
      });
      const deleteTx = db.transaction('outbox', 'readwrite');
      await deleteTx.objectStore('outbox').delete(request.id);
    } catch (error) {
      console.error('Sync failed for request:', request.id);
    }
  }
}

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'medical-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '查看详情'
      },
      {
        action: 'dismiss',
        title: '稍后处理'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});