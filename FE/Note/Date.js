(function() {
    var getDateObj = function() {
        var date = new Date(time),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        return {
            year,
            month,
            day,
            hour,
            minute,
            second
        }
    }

    var leftPad = function(val) {     
        return val < 10 ? '0' + val : val;
    }
    var formatTime = function(time, formatStr) {
        //   yyyy-mm-dd HH:MM:SS   =>  2016-08-22 04:50:40
        //   yyyy年mm月dd日 HH时MM分SS秒  =>  2016年8月22日 05时50分40秒
        var date = new Date(time),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        var returnStr = formatStr;

        var dateObj = {
            yy: year,
            y: String(year).slice(-2),
            mm: leftPad(month),
            m: month,
            dd: leftPad(day),
            d: day,
            HH: leftPad(hour),
            H: hour,
            MM: leftPad(minute),
            M: minute,
            SS: leftPad(second),
            S: second
        }
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
        var j;
        for (var i in regObj) {
            returnStr = returnStr.replace(regObj[i], dateObj[i]);
        }
        return returnStr;
    }
    //   formatTime(1488184353461, 'yyyy-mm-dd HH:MM:SS')
    function getMonthDay(year, month) { //如获取2008年2月的天数  => getMonthDay(2008,2)===29
        return new Date(year, month, 0).getDate();
        //原理: js中月份是从0开始的,天数是从1开始的,0表示当前月份的前一天
    }
    //   module.export={formatTime};
})();

/*
  总结:

    getDay()    //  获得星期几 [0,6]  总是和getDate()搞混...    而且只有getDay和getMonth数值上是少1的
    getDate()   //  [1,31] 
    
    初始化:
    new Date(year)            不可行
    new Date(year,month)      可行
    new Date(year,month,day)  可行
    new Date(year,month,day,hour) ...可行

    Chrome控制台:
    toLocalDateString   =>   "2017/2/27"
    toLocaleTimeString   =>  "下午3:42:00"

*/
