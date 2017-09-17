(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.utils = factory());
}(this, (function () { 'use strict';

// 自己的版本
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
function leftpad(str, len, ch) {
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
  }
};



var Tools = Object.freeze({
	debounce: debounce,
	leftpad: leftpad,
	throttle: throttle,
	Url: Url
});

/*
  YYYY-MM-DD hh:MM:SS   =>  2016-08-22 04:50:40
  YYYY年MM月DD日 hh时MM分SS秒  =>  2016年8月22日 05时50分40秒
 */

function leftpad$2(v) {
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
    MM: leftpad$2(month),
    M: month,
    DD: leftpad$2(day),
    D: day,
    hh: leftpad$2(hour),
    h: hour,
    mm: leftpad$2(minute),
    m: minute,
    ss: leftpad$2(second),
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
function leftpad$3(v) {
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
    DD: leftpad$3(day),
    D: day,
    hh: leftpad$3(hour),
    h: hour,
    mm: leftpad$3(minute),
    m: minute,
    ss: leftpad$3(second),
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



var date = Object.freeze({
	countdown: countdown,
	formatDate: formatDate,
	getDays: getDays,
	getDaysBetween: getDaysBetween,
	isLeapYear: isLeapYear,
	parseDate: parseDate
});

var utils;
utils = Object.assign({}, Tools, date);

var utils$1 = utils;

return utils$1;

})));
