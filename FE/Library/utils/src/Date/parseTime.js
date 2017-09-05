/**
 * 更加给定的毫秒数和基准时间返回 剩下的时间 (一般用于倒计时)
 * @param {毫秒数} ms
 * @param {作为基准的时间(默认为当前日期)} now
 * @param {最大的单位} maxUnit
 *
 */
import isDate from '../Is/isDate';
import parseDate from './parseDate';

function parseTime(ms, now, maxUnit) {
    var now = now || new Date(),
        stopDate = isDate(now)
            ? now
            : new Date(now),
        stopDateObj = parseDate(stopDate),
        endDate = stopDate.setMilliseconds(stopDateObj.millisecond - ms),
        endDateObj = parseDate(endDate);
    return {
        year: stopDateObj.year - endDateObj.year,
        month: stopDateObj.month - endDateObj.month,
        day: stopDateObj.day - endDateObj.day,
        hour: stopDateObj.hour - endDateObj.hour,
        minute: stopDateObj.minute - endDateObj.minute,
        second: stopDateObj.second - endDateObj.second,
        millisecond: stopDateObj.millisecond - endDateObj.millisecond
    }
}
export default parseTime;