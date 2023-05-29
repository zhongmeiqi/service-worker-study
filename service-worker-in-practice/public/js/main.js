/**
 * @file main.js
 */

window.addEventListener("load", function (event) {
  if ("serviceWorker" in window.navigator) {
    navigator.serviceWorker
      .register("sw.js", { scope: "/" })
      .then(function (registeration) {
        // 这里可以打印sw的作用范围
        console.log("Service worker register with scope", registeration.scope);
      })
      .catch((error) => {
        console.log(error, "sw fail");
      });

    navigator.serviceWorker.oncontrollerchange = function (event) {
      window.alert("页面已更新");
      console.log("页面已更新");
    };

    if (!navigator.onLine) {
      window.alert("网络已断开，内容可能已过期");

      window.addEventListener("online", function (event) {
        window.alert("网络已连接，刷新获取最新内容");
      });
    }
  } else {
    console.log("fail");
  }
});

