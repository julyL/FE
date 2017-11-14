// 自己的版本
function debounce1(func, wait, immediate) {
  var timer;
  return function() {
    var context = this,
      args = arguments;
    if (immediate) {
      func.apply(context, args);
      immediate = false;
      return;
    }
    timer && clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(context, args);
      clearTimeout(timer);
      timer = null;
    }, wait);
  };
}

/** underscore版本

debounce(function, wait, [immediate])
返回 function 函数的防抖版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后.
传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 。（注：并且在 wait 的时间之内，不会再次调用。）

debounce(func,wait)
debounce(func,wait,true)
 */

function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = +new Date() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = +new Date();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
export default debounce;
