(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.utils = factory());
}(this, (function () { 'use strict';

/*
	使用 new Date("2015/05/04")进行格式化
	new Date("2015-05-04") 会存在兼容性问题
 */

function leftpad(v) {
    return v < 10 ? '0' + v : v;
}

function format(time, formatStr) {
    //   yyyy-mm-dd HH:MM:SS   =>  2016-08-22 04:50:40
    //   yyyy年mm月dd日 HH时MM分SS秒  =>  2016年8月22日 05时50分40秒
    var date = new Date(time),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    var dateObj = {
        yy: year,
        y: String(year).slice(-2),
        mm: leftpad(month),
        m: month,
        dd: leftpad(day),
        d: day,
        HH: leftpad(hour),
        H: hour,
        MM: leftpad(minute),
        M: minute,
        SS: leftpad(second),
        S: second
    };
    var regObj = {
        yy: /yyyy/,
        y: /yy/,
        mm: /mm/,
        m: /m/,
        dd: /dd/,
        d: /d/,
        HH: /HH/,
        H: /H/,
        MM: /MM/,
        M: /M/,
        SS: /SS/,
        S: /S/
    };
    for (var i in regObj) {
        formatStr = formatStr.replace(regObj[i], dateObj[i]);
    }
    return formatStr;
}

/**
 * 返回当月的天数
 * @param {年份或者Date对象} yearOrdate
 * @param {月份(传了Date时默认忽略)} month
 *
 * getDays(2004,2) => 29
 * getDays(new Date("2004/02")) => 29
 */
function getDays(yearOrdate, month) {
    var y = yearOrdate,
        m = month;
    if (yearOrdate instanceof Date) {
        y = yearOrdate.getFullYear();
        m = yearOrdate.getMonth() + 1;
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
 * getObject(new Date("2017/09/05"))
*   => {
        date: 5,
        day: 2,
        longDayName: "Tuesday",
        longMonthName: "September",
        month: 9,
        shortDayName: "Tue",
        shortMonthName: "Sep",
        year: 2017
    }
*/
function getDetails(dat) {
    var shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        longDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        longMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
        shortDayName: shortDayNames[day],
        longDayName: longDayNames[day],
        shortMonthName: shortMonthNames[month - 1],
        longMonthName: longMonthNames[month - 1]
    };
}

var Date$1 = {
    format: format,
    getDays: getDays,
    getDaysBetween: getDaysBetween,
    getDetail: getDetails
};

var index = {
    Date: Date$1
};

return index;

})));
