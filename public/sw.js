// Service Worker for Yoga App - Offline Support
// Caches critical assets for offline practice capability

const CACHE_NAME = 'yoga-app-v1';
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  // Core screens
  '/src/screens/Welcome.jsx',
  '/src/screens/Practice.jsx',
  '/src/screens/Sessions.jsx',
  '/src/screens/Complete.jsx',
  // Essential data
  '/src/data/poses.js',
  '/src/data/sessions.js',
  // Critical services
  '/src/services/voice.js',
  '/src/stores/progress.js',
  // Design system
  '/src/components/design-system/index.js',
  // CSS
  '/src/index.css'
];

// Assets that are nice to have but not critical
const SECONDARY_ASSETS = [
  '/src/components/design-system/Button.jsx',
  '/src/components/design-system/Card.jsx',
  '/src/components/design-system/Typography.jsx',
  '/src/components/design-system/Container.jsx',
  '/src/components/design-system/Progress.jsx',
  '/src/components/design-system/Icon.jsx',
  '/src/components/design-system/Overlay.jsx'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Critical assets cached');
        // Activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip Chrome extension requests
  if (event.request.url.includes('chrome-extension://')) {
    return;
  }

  // Skip requests for hot reload during development
  if (event.request.url.includes('@vite/client') ||
      event.request.url.includes('__vite_ping') ||
      event.request.url.includes('sockjs-node')) {
    return;
  }

  event.respondWith(
    handleFetch(event.request)
  );
});

// Fetch handler with cache-first strategy for app resources
async function handleFetch(request) {
  const url = new URL(request.url);

  try {
    // For app resources, try cache first
    if (isAppResource(url)) {
      return await cacheFirst(request);
    }

    // For other resources, try network first
    return await networkFirst(request);
  } catch (error) {
    console.error('Service Worker: Fetch failed', error);

    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match('/') || await cache.match('/index.html');
    }

    // For other requests, just fail
    throw error;
  }
}

// Check if URL is an app resource that should be cached
function isAppResource(url) {
  // App routes and resources
  const appPaths = ['/', '/sessions', '/practice', '/complete', '/progress'];
  const isAppPath = appPaths.includes(url.pathname) || url.pathname.startsWith('/src/');
  const isAsset = url.pathname.endsWith('.js') ||
                  url.pathname.endsWith('.jsx') ||
                  url.pathname.endsWith('.css') ||
                  url.pathname.endsWith('.svg') ||
                  url.pathname.endsWith('.png');

  return isAppPath || isAsset;
}

// Cache-first strategy: try cache, fallback to network
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log('Service Worker: Serving from cache', request.url);
    return cachedResponse;
  }

  console.log('Service Worker: Fetching from network', request.url);
  const networkResponse = await fetch(request);

  // Cache successful responses
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network-first strategy: try network, fallback to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url);
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Cache secondary assets when idle
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_SECONDARY_ASSETS') {
    cacheSecondaryAssets();
  }
});

// Cache non-critical assets in the background
async function cacheSecondaryAssets() {
  try {
    const cache = await caches.open(CACHE_NAME);

    // Cache secondary assets one by one (non-blocking)
    for (const asset of SECONDARY_ASSETS) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
        }
      } catch (error) {
        console.warn('Service Worker: Failed to cache secondary asset', asset, error);
      }
    }

    console.log('Service Worker: Secondary assets cached');
  } catch (error) {
    console.error('Service Worker: Failed to cache secondary assets', error);
  }
}

// Handle sync events for background operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Could sync progress data or other background tasks
      console.log('Service Worker: Background sync triggered')
    );
  }
});

// Notification click handler (for future use)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow('/')
  );
});