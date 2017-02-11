    import Vue from 'vue';

    Vue.filter('number', {
        read(val) {
            return val;
        },
        write(val) {
            if (val == '') {
                return ''
            };
            if (/^\d+\.?\d?$/.test(val)) {
                return val;
            } else {
                return 0;
            }
        }
    });
    //正整数
    Vue.filter('toFixed', (val, number) => {
        return (+val).toFixed(number || 0)
    });
    Vue.filter('float', {
        read(val) {
            return val;
        },
        write(val) {
            if (val == '') {
                return ''
            };
            if (/^\d{1}\d*\.?\d*$/.test(val)) {
                return val;
            } else {
                return 0;
            }
        }
    });
    Vue.filter('getTime', (time) => {
        let date = new Date(time * 1000);
        return date.toString().match(/\d{2}:\d{2}:\d{2}/g)[0];
    });

    Vue.filter('formatTime', (time, sign) => {
        var date = new Date(time * 1000),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            mark = sign || "-";
        return year + mark + month + mark + day;
    });
    Vue.filter('textoverflow', (val, num) => {
        if (!val) {
            return;
        }
        if (val.length < num) {
            return val;
        } else {
            return val.slice(0, num).replace(/[.、。！？]$/, '') + "...";
        }
    });
