(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.utils = factory());
}(this, (function () { 'use strict';

/*
	使用 new Date("2015/05/04")进行格式化  
	new Date("2015-05-04") 会存在兼容性问题
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

function addDays(date, days) {
    var dat = new Date(date.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDaysBetween(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}

var date = {
    getDays: getDays,
    addDays: addDays,
    getDaysBetween: getDaysBetween
};

var index = {
    date: date
};

return index;

})));
