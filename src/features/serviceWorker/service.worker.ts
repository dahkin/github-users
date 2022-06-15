const _self = self as unknown as ServiceWorkerGlobalScope;

const date = new Date();
const firstJan = new Date(date.getFullYear(), 0, 1);
const version = [
  'v',
  date.getFullYear(),
  Math.floor((date.getTime() - firstJan.getTime()) / (1000 * 60 * 60 * 24 * 7)),
].join('.');
const cachePrefix = 'github-cache';
const cacheName = cachePrefix + '_' + version;

const mainPageRequest = 'https://api.github.com/users';

// Add cached date
const getResponseWithDate = (response: Response) => {
  const newHeaders = new Headers(response.headers);
  newHeaders.append('sw-date', `${new Date().getTime()}`);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

_self.addEventListener('install', (event) => {
  console.log('Installing [Service Worker]', event);

  // Precaching for the main page
  event.waitUntil(
    caches
      .open(cacheName)
      .then(async (cache) => {
        cache.add('/');
        fetch(mainPageRequest).then((response) => cache.put(mainPageRequest, getResponseWithDate(response)));
      })
      .catch((e) => console.error('sw install error', e))
  );
});

_self.addEventListener('activate', function (event) {
  console.log('Activating [Service Worker]', event);
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        // Remove caches whose name is no longer valid
        return Promise.all(
          keys
            .filter(function (key) {
              return key.startsWith(cachePrefix) && !key.endsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .catch((e) => console.error('sw activation failed', e))
  );
});

_self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  const request = e.request;

  if (url.startsWith('http') && e.request.method === 'GET') {
    const isHtmlPageRequest =
      request.headers.get('Accept')?.indexOf('text/html') !== -1 && url.startsWith(_self.origin);
    const isImageRequest = !isHtmlPageRequest && request.headers.get('Accept')?.indexOf('image/') !== -1;
    const apiRequest = url.indexOf('api.github.com') > -1 && url.startsWith('http') && e.request.method === 'GET';
    const cacheKey = isHtmlPageRequest ? '/' : e.request;

    // Check if cache response hasn't expired
    const isValid = (response: Response) => {
      if (!response) return false;
      const fetched = response.headers.get('sw-date');
      return fetched && parseFloat(fetched) + 1000 * 60 * 60 * 24 > new Date().getTime();
    };

    e.respondWith(
      (async () => {
        // Cache-first, images requests
        if (isImageRequest) {
          const response = await caches.match(cacheKey);
          if (response) {
            return response;
          }
        }

        // Cache-first for 1 day, API requests
        if (apiRequest) {
          const response = await caches.match(cacheKey);
          if (response && isValid(response)) {
            return response;
          }
        }

        // Fetch data, put in cache
        try {
          const response = await fetch(request);
          const cache = await caches.open(cacheName);
          const copyResponse = response.clone();
          if (apiRequest) {
            cache.put(cacheKey, getResponseWithDate(response));
          } else {
            cache.put(cacheKey, response);
          }
          return copyResponse;
        } catch (e) {
          // do nothing
        }

        // Offline without expiration check
        const response = await caches.match(cacheKey);
        if (response) {
          return response;
        }

        // Return error
        return new Response('', {
          status: 502,
          statusText: 'No Connection',
        });
      })()
    );
  }
});
