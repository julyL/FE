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
export default isLeapYear;
