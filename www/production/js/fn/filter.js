    import Vue from 'vue';
    Vue.filter('toFixed', (val, number) => { // 处理数字
        if (isNaN(+val)) {
            return 0;
        }
        return (+val).toFixed(number || 0)
    });

    Vue.filter('formatTime', (time, sign) => {
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
        return formatTime(time,sign);
    });

    Vue.filter('textoverflow', (val, num) => { //限制字符串长度，添加...显示
        if (!val) {
            return;
        }
        if (val.length < num) {
            return val;
        } else {
            return val.slice(0, num).replace(/[.、。！？]$/, '') + "...";
        }
    });
