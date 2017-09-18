import isDate from "../is/isDate";

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
    hour = Math.floor((temp % 86400) / 3600),
    minute = Math.floor((temp % 3600) / 60),
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
    return { day, hour, minute, second, millisecond };
  }
}
export default countdown;
