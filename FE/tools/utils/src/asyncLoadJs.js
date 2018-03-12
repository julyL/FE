/**
 * 依赖Promise
 * asyncLoadJS(['a.js', 'b.js']).then(() => console.log('all done'));   // a.js和b.js没有依赖关系
 * asyncLoadJS(['a.js', 'b.js'],true).then(() => console.log('load a then load b'));   // a.js加载完再加载b.js
 * @param {Array} arrayJs 数组里面存放了需要下载的js的url
 * @param {bollean} bysort  数组中的下载执行顺序是否按照数组顺序
 */
function asyncLoadJs(arrayJs, bysort) {
  if (Array.isArray(arrayJs)) {
    if (!bysort) {
      return Promise.all(arrayJs.map(loadJs));
    } else {
      arrayJs.reduce((prev, now) => {
        return prev.then(() => {
          return loadJs(now);
        })
      }, Promise.resolve())
    }
  } else {
    return loadJs(arrayJs);
  }
}

function loadJs(src) {
  const script = document.createElement("script");
  script.src = src;

  // 返回一个独立的promise
  return new Promise((resolve, reject) => {
    var done = false;

    script.onload = script.onreadystatechange = () => {
      if (!done && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
        done = true;

        // 避免内存泄漏
        script.onload = script.onreadystatechange = null;
        resolve(script);
      }
    };
    script.onerror = function () {
      reject(src + " load fail");
    }

    script.onerror = reject;
    document
      .getElementsByTagName("head")[0]
      .appendChild(script);
  });
}

export default asyncLoadJs;
