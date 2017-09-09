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
export default getDaysBetween;
