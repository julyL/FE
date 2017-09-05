/**
 * 返回date的各个信息
 * @param {date对象(或毫秒时间戳)} dat
 * parseDate(new Date("2017/09/05"))
*   => {
        year: 2017
        month: 9,
        date: 5,
        day: 2,
        second:0,
        millisecond:0,
        longDayName: "Tuesday",
        longMonthName: "September",
        shortDayName: "Tue",
        shortMonthName: "Sep",
    }
*/
function parseDate(dat) {
    var shortDayNames = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ],
        longDayNames = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        shortMonthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        longMonthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
    var year,
        month,
        date,
        day,
        hour,
        minute,
        second,
        millisecond,
        shortDayName,
        longDayName,
        shortMonthName,
        longMonthName;

    if (!(dat instanceof Date)) {
        dat = new Date(dat);
    }
    month = dat.getMonth() + 1;
    day = dat.getDay();
    return {
        year: dat.getFullYear(),
        month,
        date: dat.getDate(),
        day,
        hour: dat.getHours(),
        minute: dat.getMinutes(),
        second:dat.getSeconds(),
        millisecond:dat.getMilliseconds(),
        shortDayName: shortDayNames[day],
        longDayName: longDayNames[day],
        shortMonthName: shortMonthNames[month - 1],
        longMonthName: longMonthNames[month - 1]
    }
}
export default parseDate;