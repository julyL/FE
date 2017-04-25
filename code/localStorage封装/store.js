/*
    localStorage的封装库
    @author julyL
    @date  2016/11/12

    store.result("a.b.c",obj)   支持路径赋值(不存在的路径或者无法赋值的会默认创建{}空对象)   
    eg:  Storage {a: "{"b":11}",length: 1}     =>   Storage {a: "{"b":{"c":22}}", length: 1}    因为a.b是数字无法添加属性,会用{}空对象代替a.b
*/

    var _set = function(key, val) {
        if (typeof val === 'object') {
            localStorage[key] = JSON.stringify(val);
        } else {
            localStorage[key] = val;
        }
    }
    var _get = function(key) {
        try {
            return JSON.parse(localStorage[key])
        } catch (err) {
            return localStorage[key];
        }
    }
    var _clear = function(key) {
        localStorage.clear();
    }

    var _result = function(str, val, isforce) {
        var paramsArr = str.split("."),
            len = paramsArr.length,
            isforce = isforce || true;
        var resultArr = [];
        if (paramsArr.length == 1) {
            if (val) {
                _set(str, val);
            } else {
                _get(str);
            }
            return;
        } else {
            resultArr[0] = _get(paramsArr[0]);
        }
        for (var i = 1; i < len; i++) {
            if (typeof resultArr[i - 1] == 'number' || typeof resultArr[i - 1] == "string" || typeof resultArr[i - 1] == 'undefined') {
                if (isforce == true) {
                    resultArr[i - 1] = {};
                } else {
                    throw new Error("localStorage中的" + paramsArr.slice(0, i).join(".") + "不是对象，无法通过点操作符设置属性,设置第三个参数为true可以对没有的属性设置为空对象{}");
                }
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
            localStorage[paramsArr[0]] = JSON.stringify(resultArr[0]);
        }
    }

    var store = function(key, val) {
        var len = key && key.split(".").length;
        if (key === undefined && val === undefined) {
            return localStorage;
        }
        if (val === undefined) {
            return len > 1 ? _result(key) : _get(key);
        }
        if (key!==undefined && val!==undefined) {
            return len > 1 ? _result(key, val) : _set(key, val);
        }
    }

    store.set = _set;
    store.get = _get;
    store.clear = _clear;
    store.result = _result;

   export default store;

