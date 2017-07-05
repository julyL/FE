//  节流    定时触发函数
//  v1.0    第一次执行也要等待wait
var throttle = function(func, wait) {
        var timer;
        return function() {
            if (timer) {
                return;
            } else {
                timer = setTimeout(function() {
                    func();
                    clearTimeout(timer);
                    timer = null;
                }, wait);
            }
        }
    }
    // v1.1   第一次是立刻执行, 可以通过设置 leading:false 禁用第一次执行
var throttle = function(func, wait, option) {
    var timer;
    option && (option.leading = option.leading || true);
    // option&&(option.leading=option.leading||true);
    return function() {
        if (option.leading === true) {
            func();
            option.leading = 'lock';
        }
        if (timer) {
            return;
        } else {
            timer = setTimeout(function() {
                func();
                clearTimeout(timer);
                timer = null;
            }, wait);
        }
    }
}





// underscore默认nested:false 全部压平,不嵌套    注：lodash默认不平,只降一维
var flatten = function(arr, nested) {
        if (!Array.isArray(arr)) {
            throw new Error("is not a Array");
        }
        var returnValue = [];
        arr.forEach(function(val) {
            if (Array.isArray(val)) {
                [].push.apply(returnValue, nested ? val : flatten(val));
            } else {
                returnValue.push(val);
            }
        });
        return returnValue;
}
    //flatten([[[1, 2], [1, 2, 3]], [1, 2]]);          //   [1, 2, 1, 2, 3, 1, 2]
    // flatten([[[1, 2], [1, 2, 3]], [1, 2]],true);     //   [Array[2], Array[3], 1, 2]
