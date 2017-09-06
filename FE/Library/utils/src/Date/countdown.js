
import isDate from '../Is/isDate';

/**
 * 返回2者之间的时间差
 * @param {起始日期} startDate 
 * @param {终止日期} endDate 
 */
function countdown(startDate, endDate) {
    var startDate = isDate(startDate) || new Date(startDate),
        endDate = isDate(endDate) || new Date(endDate),
        temp = (endDate - startDate)/1000,
        day = Math.floor(temp / 86400),
        hour = Math.floor(temp % 86400 / 3600),
        minute = Math.floor((temp % 3600) / 60),
        second = Math.floor(temp % 60 ),
        millisecond = Math.floor(temp);
    return {day, hour, minute, second, millisecond}
}
export default countdown;