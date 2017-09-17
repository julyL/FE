/*
  YYYY-MM-DD hh:MM:SS   =>  2016-08-22 04:50:40
  YYYY年MM月DD日 hh时MM分SS秒  =>  2016年8月22日 05时50分40秒
 */

function leftpad(v) {
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
    MM: leftpad(month),
    M: month,
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
export default formatDate;
