/*
	使用 new Date("2015/05/04")进行格式化
	new Date("2015-05-04") 会存在兼容性问题
 */

function leftpad(v){
    return v<10?'0'+v:v;
}

function formatDate(time, formatStr) {
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
    for (var i in regObj) {
        formatStr = formatStr.replace(regObj[i], dateObj[i]);
    }
    return formatStr;
}
export default formatDate;
