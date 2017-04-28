/*
    localStorage的封装库
    @author julyL
    @date  2016/11/12

*/
(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Store = factory());
}(this, function() {
    var encode = function(str) {
        return store.encode == true ? window.encodeURIComponent(str) : str;
    }
    var decode = function(str) {
        return store.encode == true ? window.decodeURIComponent(str) : str;
    }
    var _set = function(key, val) {
        if (typeof val === 'object') {
            localStorage[key] = encode(JSON.stringify(val));
        } else {
            localStorage[key] = encode(val);
        }
    }
    var _get = function(key) {
        try {
            return JSON.parse(decode(localStorage[key]));
        } catch (err) {
            return decode(localStorage[key]);
        }
    }
    var _clear = function(key) {
        localStorage.clear();
    }

    function isJSON(obj) {
        return typeof obj === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]";
    }

    var _result = function(str, val, time) {
        var paramsArr = str.split("."),
            len = paramsArr.length,
            isforce = isforce || true;
        var resultArr = [];
        if (paramsArr.length == 1) {
            if (val) {
                _set(str, val, time);
            } else {
                _get(str);
            }
            return;
        } else {
            resultArr[0] = _get(paramsArr[0]);
        }
        for (var i = 1; i < len; i++) {
            if (!isJSON(paramsArr[i - 1])) { //如果不是对象,强制置为空对象
                resultArr[i - 1] = {};
            }
            resultArr[i] = resultArr[i - 1][paramsArr[i]];
        }
        if (val === undefined) { //取值操作
            return resultArr[len - 1];
        } else {
            resultArr[len - 1] = val;
            for (var i = len - 1; i >= 1; i--) {
                resultArr[i - 1][paramsArr[i]] = resultArr[i];
            }
            localStorage[paramsArr[0]] = encode(JSON.stringify(resultArr[0]));
        }
    }
    var store = function(key, val, time) {
        var len = key && key.split(".").length;
        if (key === undefined && val === undefined) {
            return localStorage;
        }
        if (val === undefined) {
            return len > 1 ? _result(key) : _get(key);
        }
        if (key !== undefined && val !== undefined) {
            return len > 1 ? _result(key, val, time) : _set(key, val, time);
        }
    }
    store.encode = false;   //默认进行编码
    store.set = _set;
    store.get = _get;
    store.clear = _clear;
    store.result = _result;
    return store;
}))
