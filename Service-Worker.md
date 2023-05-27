自身的更新机制
生命周期相关的知识

- install 阶段缓存文件列表
- activate 阶段清理缓存
- fetch 拦截请求

有没有成熟的开发工具呢？（以下都由 Google 开发）

- sw-precache 预缓存
- sw-toolbox 动态缓存
- workbox 集大成者

工具特性：

- 命令行，构建工具
- 注入已有 service worker
- 生成全新 service worker

本节课：以 webpack 插件为例

- DEMO https://xiaoiver.github.io/sw-tools/examples
- Github https://github.com/xiaoiver/sw-tools

预缓存

- App Shell（包含了可以运行的最小资源集合，html,js） 所需静态资源(每次构建都需要重新生成)
- CacheFirst 缓存策略

```js

```

sw-precache 有对应的 webpack 配套插件 https://github.com/goldhand/sw-precache-webpack-plugin

```js
//webpack.config.js(只配置这两个就行了)
new SWPrecacheWebpackPlugin({
  cacheId: "sw-tools",
  filename: "service-worker.js",
});

// service-worker.js - 生成预缓存列表
var precacheCOnfig = [
  // 静态资源、版本号（重新构建时会生成，hash）
  [".../dist/index.js", "636d...fdb4"],
  [".../dist/index.css", "ddc3...bf73"],
  [".../dist/index.html", "4d5b...9086"],
];
```

sw-toolbox 动态缓存 (实际请求的时候才去缓存)

- 动态内容
- API
- 第三方资源
- 用户头像...

```js
// 没有独立的webpack插件,sw-precache 已经集成进来了
// webpack.config.js
new SWPrecacheWebpackPlugin({
    cacheId:'sw-tools',
    filename:'service-worker.js',
    runtimeCaching:[{
        urlPattern:'/.*\.png$',
        handler:'newworkFirst'
    }]
})

//service-worker.js
precache代码...

引入sw-toolbox代码...
// 资源路由匹配规则，缓存策略
toolbox.router.get("/.*.png$",toolbox.newworkFirst,{})
```

workbox 终极方案 https://xiaoiver.github.io/sw-tools/examples/workbox/dist/index.html

```js
// webpack.config.js
new WorkboxWebpackPlugin.IndectManifest({
    // 已有Service Worker路径
    swSrc:path.resolve(__dirname,'src/service-worker.js'),
    // 目标Service Worker路径
    swDest:'service-worker.js',
    // 图片不加入预缓存列表，稍后我们会用动态缓存处理它
    exclude:[/\.png$],
    // 使用本地的Workbox,使用本地代码不使用Chrome的代码了
    importWorkkboxFrom:'local'
})

// service-worker.js 使用Service Worker预缓存功能
// 构建时会 ：importScripts("/dist/precache-manifest.7cf672a.js','/dist/workbox-v3.3.1/workbox-sw.js')

workbox.precaching.precacheAndRoute(self.__precacheManifest)
self.__precacheManifest = [
    {
    "revision":"hash值",
    "url":"/sw-tools/exmples/workbox/dist/index.html/"
}]

//  service-worker.js 使用Service Worker动态缓存功能
workbox.routing.registerRoute(/.*\.(?:png|jpg|jpeg|svg|gif)/g,workbox.strategies.cacheFirst({cacheName:"my-image-cache"}))//通过cacheName指定一块新的缓存（任意创建缓存）



```
