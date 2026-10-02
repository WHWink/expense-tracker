/* Service Worker：让应用离线可用（添加到主屏幕后断网也能打开记账）。
 *
 * 策略：
 * - install 时预缓存入口 + 解析 index.html 里的哈希资源（js/css）一并缓存，
 *   保证首次打开后即可完全离线
 * - 页面导航：网络优先，失败时回退缓存 —— 在线时总能拿到新版本
 * - 其他本站资源（含导出功能的按需分包）：缓存优先
 * 修改本文件时把 CACHE 里的版本号 +1，旧缓存会在 activate 时自动清理 */
const CACHE = 'jizhang-v3'
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(CORE)
      // index.html 引用的带哈希资源（js/css）是离线运行的必需品，这里解析出来预缓存
      const html = await (await fetch('/index.html')).text()
      const assetUrls = [...new Set(html.match(/\/assets\/[^"'\s<>)]+?\.(?:js|css)/g) ?? [])]
      await Promise.allSettled(assetUrls.map((url) => cache.add(url)))
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  // 只处理本站 GET 请求
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return

  // 页面导航：网络优先，离线回退缓存
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((cache) => cache.put(req, copy))
          return res
        })
        .catch(() =>
          caches
            .match(req, { ignoreVary: true })
            .then((cached) => cached || caches.match('/index.html', { ignoreVary: true })),
        ),
    )
    return
  }

  // 静态资源：缓存优先，没命中再走网络并写入缓存。
  // ignoreVary：缓存里的响应带 Vary: Origin（vite 预览服务所加），
  // 页面加载脚本时的请求头和预缓存时不一致会导致 Vary 匹配 miss，离线就白缓存了
  event.respondWith(
    caches.match(req, { ignoreVary: true }).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(req, copy))
          }
          return res
        }),
    ),
  )
})
