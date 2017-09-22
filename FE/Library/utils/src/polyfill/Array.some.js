if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg */) {
    "use strict";

    if (this === void 0 || this === null) throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) return true;
      // i in t 这里会直接跳过没有index值的数组
      // 例如: new Array(4) 生成的数组没有index,又称稀疏数组 或者delete arr[index]  2者都会跳过执行
    }

    return false;
  };
}
