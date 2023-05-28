/**
 * @file sw.js
 */
let CACHE_VERSION = 3;
let CACHE_NAME = "cache_v" + CACHE_VERSION;
let CACHE_URLS = [
  "/", // index.html
  "/js/main.js",
  "/css/main.css",
  "/img/logo.png",
];

console.log("hello service world11");

function precache() {
  return caches.open(CACHE_NAME).then(function (cache) {
    cache.addAll(CACHE_URLS);
  });
}

function clearCache() {
  return caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_NAME) {
        caches.delete(key);
      }
    });
  });
}

function fetchAndCache(req) {
  return fetch(req).then(function (res) {
    saveToCache(req, res.clone());
    return res;
  });
}

function saveToCache(req, res) {
  return caches.open(CACHE_NAME).then((cache) => cache.put(req, res));
}

self.addEventListener("install", function (event) {
  event.waitUntil(precache().then(self.skipWaiting));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(Promise.all([clearCache(), self.clients.claim()]));
});

self.addEventListener("fetch", function (event) {
  console.log("request" + event.request.url);
  // 只针对同源的才走service worker
  let url = new URL(event.request.url);
  if (url.origin !== self.origin) {
    // 如果是不同域的都走cdn，而不是从service worker
    return;
  }
  // 如果要缓存最新的资源
  if (event.request.url.includes("/api/movies")) {
    event.respondWith(
      fetchAndCache(event.request).cache(function () {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 优先从网络请求，如果失败就去缓存里面找
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
