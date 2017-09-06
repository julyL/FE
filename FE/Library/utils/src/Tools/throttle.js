

// 节流:  当频繁调用throttle(func,wait)时, wait时间之内只能执行一次func
var throttle1 = function (func, wait, option) {
    var timer;
    return function () {
        var args = arguments,
            context = this;
        if (option && option.leading) {  //leading为真表示第一次立即执行,随后的执行才有"频率"限制
            func.call(context, args);
        }
        if (timer) {
            return;
        } else {
            timer = setTimeout(function () {
                if (option && option.leading) {
                    option.leading = false;
                } else {
                    func.call(context, args);
                }
                clearTimeout(timer);
                timer = null;
            }, wait);
        }
    }
}

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
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
export default throttle;
