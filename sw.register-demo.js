this.addEventListener('install', function (event) {
    // 只有文件缓存成功才会waitUntill才会resolve，安装才会结束，进行下一步
    event.waitUntill(
    // 调用open方法会开辟一块和service worker相对应的缓存区域，并命名为my-cache-v1。
    // 这个方法也会返回一个promise，缓存开辟成功会触发then回调函数
    caches.open('my-cache-v1').then(function (cache) {
        // 我们要缓存的文件列表，addAll返回的也是一个promise对象（有一个缓存失败都会reject失败，所以如果预缓存的内容越多，失败的风险也越大）
        return cache.addAll({
            '/',
            '/test.js',
            '/test.css'
        });
    }))

    this.addEventListener('activate',function(event){
        event.waitUntill(
        Promise.all([
            // 让被激活的sw拥有对client的完全控制权(跳过这个刷新页面步骤)
            this.clients.claim(),
            caches.keys().then(function (cacheList){
                return Promise.all(cacheList.map(function(cacheName){
                    if(cacheName !=='my-cache-v1'){
                        return caches.delete(cacheName)
                    }
                }))
            })
        ])
     )
    })

})