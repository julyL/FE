(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.utils = {})));
}(this, (function (exports) { 'use strict';

/*
  获取2个时间之内剩余的时间(天,小时等) 一般用于倒计时 
  countdown(3666006)
   => {
    day : 0,
    hour : 1,
    minute : 1,
    second : 6,
    millisecond : 6
  }
*/
function leftpad(v) {
  return v < 10 ? "0" + v : v;
}
function countdown(startDate, endDate, formatStr) {
  if (!endDate) {
    endDate = startDate;
    startDate = 0;
  }
  var temp = (endDate - startDate) / 1000,
      day = Math.floor(temp / 86400),
      hour = Math.floor(temp % 86400 / 3600),
      minute = Math.floor(temp % 3600 / 60),
      second = Math.floor(temp % 60),
      millisecond = Math.floor((endDate - startDate) % 1000);

  var dateObj = {
    DD: leftpad(day),
    D: day,
    hh: leftpad(hour),
    h: hour,
    mm: leftpad(minute),
    m: minute,
    ss: leftpad(second),
    s: second
  };
  var regObj = {
    DD: /DD/,
    D: /D/,
    hh: /hh/,
    h: /h/,
    mm: /mm/,
    m: /m/,
    ss: /ss/,
    s: /s/
  };
  if (formatStr) {
    for (var i in regObj) {
      formatStr = formatStr.replace(regObj[i], dateObj[i]);
    }
  } else {
    return { day: day, hour: hour, minute: minute, second: second, millisecond: millisecond };
  }
}

/*
  YYYY-MM-DD hh:MM:SS   =>  2016-08-22 04:50:40
  YYYY年MM月DD日 hh时MM分SS秒  =>  2016年8月22日 05时50分40秒
 */

function leftpad$1(v) {
  return v < 10 ? "0" + v : v;
}

function formatDate(time, formatStr) {
  var date = new Date(time),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds();

  var dateObj = {
    YY: year,
    Y: String(year).slice(-2),
    MM: leftpad$1(month),
    M: month,
    DD: leftpad$1(day),
    D: day,
    hh: leftpad$1(hour),
    h: hour,
    mm: leftpad$1(minute),
    m: minute,
    ss: leftpad$1(second),
    s: second
  };
  var regObj = {
    YY: /YYYY/,
    Y: /YY/,
    MM: /MM/,
    M: /M/,
    DD: /DD/,
    D: /D/,
    hh: /hh/,
    h: /h/,
    mm: /mm/,
    m: /m/,
    ss: /ss/,
    s: /s/
  };
  for (var i in regObj) {
    formatStr = formatStr.replace(regObj[i], dateObj[i]);
  }
  return formatStr;
}

/**
 * 是否为闰年
 * @param {年份} Year 
 */
function isLeapYear(Year) {
  if (Year % 4 == 0 && (Year % 100 != 0 || Year % 400 == 0)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 返回天数
 * @param {年份或者Date对象} yearOrdate
 * @param {月份(传了Date时默认忽略)} month
 * getDays(2004) => 366
 * getDays(2004,2) => 29
 * getDays(new Date("2004/02")) => 29
 */
function getDays(yearOrdate, month) {
  var y = yearOrdate,
      m = month;
  if (yearOrdate instanceof Date) {
    y = yearOrdate.getFullYear();
    m = yearOrdate.getMonth() + 1;
  } else if (!m) {
    return isLeapYear(y) ? 366 : 365;
  }
  return new Date(y, m, 0).getDate();
}

/**
 * 返回Date对象增加days天数之后的Date对象
 * @param {Date对象} date
 * @param {增加的天数} days
 */
function addDays(date, days) {
  var dat = new Date(date.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

/**
 * 返回 2个Date对象之间的所有日期(数组)
 * @param {开始的日期} startDate
 * @param {结束的日期} stopDate
 *
 * getDaysBetween(new Date("2004/02/28"),new Date("2004/03/02"))  => [Date对象("2004/02/28"),Date对象("2004/02/29"),Date对象("2004/03/01"),Date对象("2004/03/02")]
 */
function getDaysBetween(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}

/**
 * 返回date的各个信息
 * @param {date对象(或毫秒时间戳)} dat
 * parseDate(new Date("2017/09/05"))
*   => {
        year: 2017
        month: 9,
        date: 5,
        day: 2,
        second:0,
        millisecond:0,
        longDayName: "Tuesday",
        longMonthName: "September",
        shortDayName: "Tue",
        shortMonthName: "Sep",
    }
*/
function parseDate(dat) {
  var shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      longDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      longMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var year, month, date, day;

  if (!(dat instanceof Date)) {
    dat = new Date(dat);
  }
  month = dat.getMonth() + 1;
  day = dat.getDay();
  return {
    year: dat.getFullYear(),
    month: month,
    date: dat.getDate(),
    day: day,
    hour: dat.getHours(),
    minute: dat.getMinutes(),
    second: dat.getSeconds(),
    millisecond: dat.getMilliseconds(),
    shortDayName: shortDayNames[day],
    longDayName: longDayNames[day],
    shortMonthName: shortMonthNames[month - 1],
    longMonthName: longMonthNames[month - 1]
  };
}

function isElement(node) {
  if (!node || node.nodeType !== 1) {
    return false;
  }
  return true;
}

/**
 * 
 * @param {需要处理的字符串} str 
 * @param {是否去掉多余的空格(有多个空格时,只保留一个空格)} replaceall 
 */
function trim(str, replaceall) {
  if (replaceall) {
    return str.replace(/^\s*|\s*$/g, "").replace(/\s+/g, " ");
  } else {
    return str.replace(/^\s*|\s*$/g, "");
  }
}

function hasClass(el, className) {
  var classNameArrays = trim(el.className, true).split(" ");
  return classNameArrays.indexOf(className) != -1 ? true : false;
}

function addClass(el, className) {
  el = isElement(el) ? el : document.querySelector(el);
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!hasClass(el, className)) {
      el.className += " " + className;
    }
  }
}

function removeClass(el, className) {
  el = isElement(el) ? el : document.querySelector(el);
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("\\s*" + className + "\\s*"), "");
  }
}

function offset(el) {
  var obj = el.getBoundingClientRect();
  return {
    left: obj.left + window.pageXOffset,
    top: obj.top + window.pageYOffset,
    width: obj.width,
    height: obj.height
  };
}

(function () {
  var lastTime = 0;
  var vendors = ["webkit", "moz"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || // Webkit中此取消方法的名字变了
    window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();

/**
 * 
 * @param {需要滚动的元素} el 
 * @param {滚动到的位置} to 
 * @param {滚动时间} time 
 */
function scrollTo(el) {
  var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

  if (typeof el == "string") {
    el = document.querySelector(el);
  }
  var scrollTop = el.scrollTop,
      distance = scrollTop - to,
      move = distance / (time / 16.7);
  (function scroll() {
    var timer = requestAnimationFrame(function () {
      if (distance > 0 && el.scrollTop - move <= to || distance < 0 && el.scrollTop - move >= to) {
        el.scrollTop = to;
      } else {
        el.scrollTop -= move;
        scroll();
      }
      cancelAnimationFrame(timer);
      timer = null;
    });
  })();
}

// 自己的版本
/** underscore版本

debounce(function, wait, [immediate])
返回 function 函数的防抖版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后.
传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 。（注：并且在 wait 的时间之内，不会再次调用。）

debounce(func,wait)
debounce(func,wait,true)
 */

function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function later() {
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

  return function () {
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

// 技巧:  快速补全 Array(3).join("0") => "00"

/**
 * 原版的left-pad模块
 * @param {需要补全的字符串} str
 * @param {补全后的长度} len
 * @param {用于补全的字符} ch
 * leftpad("6",2,0) = > "06"
 */
function leftpad$2(str, len, ch) {
  str = String(str);

  var i = -1;

  if (!ch && ch !== 0) ch = " ";

  len = len - str.length;

  while (++i < len) {
    str = ch + str;
  }

  return str;
}

// 自己的版本   leading为真表示第一次立即执行,随后的执行wait之内只触发一次
// 节流:   当频繁调用throttle(func,wait)时, wait时间之内只能执行一次func
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
  var later = function later() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
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

var Url = function Url(url) {
  if (!(this instanceof Url)) {
    return new Url(url);
  }
  this.url = url || window.location.href;
};
Url.prototype = {
  parse: function parse() {
    var parser = document.createElement("a");
    // http://example.com:3000/pathname/?search=test#hash
    parser.href = this.url;
    return {
      protocol: parser.protocol, // => "http:"
      hostname: parser.hostname, // => "example.com"
      port: parser.port, // => "3000"
      pathname: parser.pathname, // => "/pathname/"
      search: parser.search, // => "?search=test"
      hash: parser.hash, // => "#hash"
      host: parser.host, // => "example.com:3000"
      href: parser.href, // => "example.com:3000"
      origin: parser.origin // => "example.com:3000"
    };
  },
  get: function get(key) {
    var params = this.parse().search.slice(1).split("&"),
        temp;
    for (var i = 0, len = params.length; i < len; i++) {
      temp = params[i].split("=");
      if (temp[0] == key) {
        return decodeURIComponent(temp[1] || "");
      }
    }
  },
  set: function set(key, val) {
    var url = this.parse(),
        params = url.search.slice(1).split("&"),
        temp,
        index;
    for (var i = 0, len = params.length; i < len; i++) {
      temp = params[i].split("=");
      if (temp[0] == key) {
        index = i;
        break;
      }
    }
    if (index) {
      params[index] = key + "=" + decodeURIComponent(val);
      this.url = url.origin + url.pathname + "?" + params.join("&");
    }
    return this.url;
  },
  remove: function remove(key) {
    var url = this.parse(),
        params = url.search.slice(1).split("&"),
        temp,
        index;
    for (var i = 0, len = params.length; i < len; i++) {
      temp = params[i].split("=");
      if (temp[0] == key) {
        index = i;
        break;
      }
    }
    this.url = url.origin + url.pathname + "?" + params.splice(index, -1).join("&");
  }
};

/**
 * 不知道对象结构时取值时,一般会采用 obj&&obj[0]&&obj.name的方法,等价于下面的方法
 *  f(obj,'[0].name') === f(obj,['0','name'])
 * @param {取值的对象} obj 
 * @param {用于取值的字符串或者数组} path 
    var testData = { a: [{ c: { b: [233] } }] };
    safeGet(testData,'a[0].c.b[0]') => 233
    safeGet(testData,['a','0','c','b','0']) => 233
 */
function safeGet(obj, path) {
  if (Array.isArray(path)) {
    return path.reduce(function (ob, k) {
      return ob && ob[k] ? ob[k] : undefined;
    }, obj);
  } else if (typeof path == "string") {
    var arrKeys = path.split("."),
        keys = [],
        m;
    arrKeys.forEach(function (k) {
      if (m = k.match(/([^\[\]]+)|(\[\d+\])/g)) {
        // arr[3][2] =>  ['arr',[3],[2]]
        m = m.map(function (v) {
          return v.replace(/\[(\d+)\]/, "$1");
        });
        // ['arr',[3],[2]] => ['arr','3','2']
        [].push.apply(keys, m);
      }
    });
    return safeGet(obj, keys);
  }
}

var babelHelpers = {};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



















































babelHelpers;

/**
 * @param {处理的对象} obj 
 * @param {路径:数组或者字符串} path 
 * @param {设置的值} val 
 * @param {当键值为正数字时,生成数组覆盖} toArray 
 * var obj1={a:1};
 * safeSet(obj1,'b.c[1]',2)  => {a:1,b:{c:{"1":2}}}
 * safeSet(obj1,'b.c[1]',2,true)  => {a:1,b:{c:[,2]}}
 * 
 * var obj2={};
 * safeSet(obj2,'1','wtf')  => {"1":'wtf'}
 * safeSet(obj2,'1','wtf',true)  => {1:'wtf'} // 只有当取的key值的父级(obj2)不为对象时,并且newArrayIfNeed==true 才会新建数组
 * 
 * var obj3=2;
 * safeSet(obj2,'1','wtf')  => {"1":'wtf'}
 * safeSet(obj2,'1','wtf',true)  => ["1":'wtf']
 * 
 * 思路:
 * obj表示对象  k:表示key  result:需要赋值的值
 * * 判断能否取值 obj    (代码A)
 *      * 能取值
 *              * obj[k]是否存在 
 *                    * 存在       
 *                          *  obj[k]不是引用对象   (代码C)
 *                                * 是否是最后一个key
 *                                      * 是,obj[k]=result
 *                                      * 不是
 *                                          *根据下一个key值和newArrayIfNeed  obj[k]={}或[] 重复A
 *                          *  obj[k]是引用对象   下一个key?ob=obj[k]并重复A: obj[k]=result                 
 *                    * 不存在
 *                          *  是否是最后一个key
 *                                      * 是,obj[k]=result
 *                                      * 不是
 *                                          *根据下一个key值和newArrayIfNeed  obj[k]={}或[] 重复A=result 
 *      * 不能取值   (代码B)
 *             * 根据key值和newArrayIfNeed  obj[k]={}或[]  下一个key?ob=obj[k]并重复A: obj[k]=result 
 * 
 */
function _newObjectOrArray(key, newArrayIfNeed) {
  if (newArrayIfNeed && parseInt(key) == key && /^(([1-9]\d*)|0)$/.test(key)) {
    return new Array(parseInt(key)); //  new Array("1") => ["1"]    -_-!!!
  } else {
    return {};
  }
}

function safeSet(obj, path, result, newArrayIfNeed) {
  if (Array.isArray(path)) {
    var ob = obj,
        ArrayObj = [],
        key,
        val;
    for (var i = 0, len = path.length; i <= len - 1; i++) {
      key = path[i];
      if ((typeof ob === "undefined" ? "undefined" : _typeof(ob)) == "object" && ob != null) {
        ArrayObj.push(ob);
        val = ob[key];
        if (val && val == "object") {
          ob[key] = val;
        } else {
          if (i == len - 1) {
            ob[key] = result;
          } else {
            ob[key] = _newObjectOrArray(path[i + 1], newArrayIfNeed);
          }
        }
      } else {
        // (代码B)
        ob = _newObjectOrArray(key, newArrayIfNeed);
        ArrayObj.push(ob);
        if (i == len - 1) {
          ob[key] = result;
        } else {
          ob[key] = _newObjectOrArray(path[i + 1], newArrayIfNeed);
        }
      }
      ob = ob[key];
    }
    return ArrayObj[0];
  } else if (typeof path == "string") {
    var arrKeys = path.split("."),
        keys = [],
        m;
    arrKeys.forEach(function (k) {
      if (m = k.match(/([^\[\]]+)|(\[\d+\])/g)) {
        m = m.map(function (v) {
          return v.replace(/\[(\d+)\]/, "$1");
        });
        [].push.apply(keys, m);
      }
    });
    return safeSet(obj, keys, result, newArrayIfNeed);
  }
}

/*
    依赖: Promise
    简单的依赖加载处理
    asyncLoadJS(['a.js', 'b.js']).then(() => console.log('all done'));
*/

function exec(src) {
  var script = document.createElement("script");
  script.src = src;

  // 返回一个独立的promise
  return new Promise(function (resolve, reject) {
    var done = false;

    script.onload = script.onreadystatechange = function () {
      if (!done && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
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

/**
*  Base64 encode / decode
*  @author haitao.tu
*  @date   2010-04-26
*  @email  tuhaitao@foxmail.com

  useage:
    Base64(124中文内容);   =>  MTI05Lit5paH5YaF5a65
    Base64.encode("124中文内容");    =>  "MTI05Lit5paH5YaF5a65"
    Base64.decode("MTI05Lit5paH5YaF5a65");  => 124中文内容
 */
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function Base64(strForEncode) {
  return Base64.encode(strForEncode);
}
Base64.encode = function (input) {
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;
  input = _utf8_encode(input);
  while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
  }
  return output;
};
Base64.decode = function (input) {
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = _keyStr.indexOf(input.charAt(i++));
    enc2 = _keyStr.indexOf(input.charAt(i++));
    enc3 = _keyStr.indexOf(input.charAt(i++));
    enc4 = _keyStr.indexOf(input.charAt(i++));
    chr1 = enc1 << 2 | enc2 >> 4;
    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    chr3 = (enc3 & 3) << 6 | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  output = _utf8_decode(output);
  return output;
};

function _utf8_encode(string) {
  string = string.replace(/\r\n/g, "\n");
  var utftext = "";
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode(c >> 6 | 192);
      utftext += String.fromCharCode(c & 63 | 128);
    } else {
      utftext += String.fromCharCode(c >> 12 | 224);
      utftext += String.fromCharCode(c >> 6 & 63 | 128);
      utftext += String.fromCharCode(c & 63 | 128);
    }
  }
  return utftext;
}

// private method for UTF-8 decoding
function _utf8_decode(utftext) {
  var string = "";
  var i = 0,
      c = 0,
      c1 = 0,
      c2 = 0,
      c3;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode((c & 31) << 6 | c2 & 63);
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      i += 3;
    }
  }
  return string;
}

exports.countdown = countdown;
exports.formatDate = formatDate;
exports.getDays = getDays;
exports.getDaysBetween = getDaysBetween;
exports.isLeapYear = isLeapYear;
exports.parseDate = parseDate;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.hasClass = hasClass;
exports.offset = offset;
exports.scrollTo = scrollTo;
exports.debounce = debounce;
exports.leftpad = leftpad$2;
exports.throttle = throttle;
exports.Url = Url;
exports.safeGet = safeGet;
exports.safeSet = safeSet;
exports.asyncLoadJs = asyncLoadJs;
exports.Base64 = Base64;

Object.defineProperty(exports, '__esModule', { value: true });

})));
