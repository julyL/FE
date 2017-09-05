/**
 * 返回天数
 * @param {年份或者Date对象} yearOrdate
 * @param {月份(传了Date时默认忽略)} month
 * getDays(2004) => 366
 * getDays(2004,2) => 29
 * getDays(new Date("2004/02")) => 29
 */
import isLeapYear from './isLeapYear';
function getDays(yearOrdate, month) {
    var y = yearOrdate,
        m = month;
    if (yearOrdate instanceof Date) {
        y = yearOrdate.getFullYear();
        m = yearOrdate.getMonth() + 1;
    } else if (!m) {
        return isLeapYear(y)
            ? 366
            : 365;
    } else {
        return new Date(y, m, 0).getDate();
    }
}
export default getDays;