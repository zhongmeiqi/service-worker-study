if ("serviceWorker" in navigator) {
  // 为什么要等待load事件触发呢？这是因为首次访问页面的时候，浏览器并不知道有哪些资源要下载，也不知道有一个服务工作线程在等待创建
  // 如果在页面加载过程中，浏览器在加载资源文件或者图片文件的进程或线程之外还要为Service Worker创建一个线程，那么对于一些移动设备甚至是一些低端手机来说，这个额外的线程无疑是加剧了对性能的消耗以及抢占了正常资源的带宽。
  // 我们使用Service Worker目标是为了提升用户体验，在首次加载页面，我们的首要任务应该尽快加载关键路径下的资源，减少白屏时间。
  // 因此延迟注册Service Worker，避免占用和浏览器性能带宽性能
  window.addEventListener("load", function () {
    // 文件路径需要同源，不同源需要用ngnix转发，而register方法本身就会返回一个promise对象，所以如果注册失败，那就会reject,注册失败
    // 第二个参数是一个对象，指定SW要控制的域
    this.navigator.serviceWorker
      .register("/static/sw-demo.js", { scope: "/static/" })
      .then(function (registration) {
        // console.log(registration.scope)
      })
      .catch(function (error) {
        // console.log('注册失败',error)
      });
  });
}
