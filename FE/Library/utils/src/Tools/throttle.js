// 自己的版本   leading为真表示第一次立即执行,随后的执行wait之内只触发一次
// 节流:   当频繁调用throttle(func,wait)时, wait时间之内只能执行一次func
var throttle1 = function(func, wait, option) {
  var timer;
  return function() {
    var args = arguments,
      context = this;
    if (option && option.leading) {
      func.call(context, args);
    }
    if (timer) {
      return;
    } else {
      timer = setTimeout(function() {
        if (option && option.leading) {
          option.leading = false;
        } else {
          func.call(context, args);
        }
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
};

/**

以下为underscore版本

创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数。
默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。

禁用第一次首先执行，设置{leading: false}
禁用最后一次执行，设置{trailing: false}

 throttle(fn,wait)
 throttle(fn,wait,{leading:false})
 throttle(fn,wait,{trailing:false})

 throttle(fn,wait,{leading:false,trailing:false})  
 错误调用: fn不会执行    remaining === wait && options.trailing === false

 */
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = +new Date();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      //remaining ∈ (0,wait]
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export default throttle;
