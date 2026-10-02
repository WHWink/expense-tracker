/* 最小 Service Worker：只为了让浏览器把本站识别为可安装的 PWA
   （安卓 Chrome 要求有 SW 才会以独立窗口方式打开）。
   离线缓存策略后续版本再完善。 */
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  // 直接走网络，暂不做缓存
})
