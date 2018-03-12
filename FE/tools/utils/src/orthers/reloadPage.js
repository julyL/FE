/**
 * IOS按返回键回退页面不会触发onload事件,回退的页面就好像保存在内存一样,页面中的变量仍然会保持和之前离开时的一样。
 * 但这往往不是我们想要的,我们希望每次页面都会重新加载。
 * 而pageshow和pagehide(对应页面的进入和退出事件)则会每次都会执行,可以根据shouldReload判断是否进行location.reload
 */
(function() {
  var shouldReload = false;
  window.addEventListener("pageshow", function() {
    if (shouldReload) {
      window.location.reload();
    }
  });
  window.addEventListener("pagehide", function() {
    // 离开页面会触发pagehide,设置showReload
    shouldReload = true;
  });
})();
