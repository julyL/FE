/*
    依赖: Promise
    简单的依赖加载处理
    asyncLoadJS(['a.js', 'b.js']).then(() => console.log('all done'));
*/

function exec(src) {
  const script = document.createElement("script");
  script.src = src;

  // 返回一个独立的promise
  return new Promise((resolve, reject) => {
    var done = false;

    script.onload = script.onreadystatechange = () => {
      if (
        !done &&
        (!script.readyState ||
          script.readyState === "loaded" ||
          script.readyState === "complete")
      ) {
        done = true;

        // 避免内存泄漏
        script.onload = script.onreadystatechange = null;
        resolve(script);
      }
    };

    script.onerror = reject;
    document.getElementsByTagName("head")[0].appendChild(script);
  });
}

function asyncLoadJs(dependencies) {
  return Promise.all(dependencies.map(exec));
}
export default asyncLoadJs;
