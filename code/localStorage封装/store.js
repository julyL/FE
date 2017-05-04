/*
    localStorage的封装库
    @author julyL
    @date  2016/11/12

    use:  Store.clear()                   =>  Storage {length: 0}
          Store("person",{name:"july"})   =>  Storage {person: "{"name":"july"}", length: 1}
          Store("person.age",23);         =>  Storage {person: "{"name":"july","age":23}", length: 1}
          Store("dog",'dogname1')         =>  Storage {dog: "dogname1", person: "{"name":"july","age":23}", length: 2}
          Store("dog.name","dogname2")    =>  Storage {dog: "{"name":"dogname2"}", person: "{"name":"july","age":23}", length: 2}  
          如果 Store("dog") 不是对象,则会直接忽略原有数据,在空对象{}基础上添加name。 如果是对象则只是添加name属性而已
*/
(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Store = factory());
}(this, function() {
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
    function isJSON(obj) {
        return typeof obj === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]";
    }
    var _result = function(str, val) {
        var paramsArr = str.split("."),
            len = paramsArr.length;
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
            if (!isJSON(resultArr[i - 1])) {
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
        if (key && val) {
            return len > 1 ? _result(key, val) : _set(key, val);
        }
    }

    store.set = _set;
    store.get = _get;
    store.clear = _clear;
    store.result = _result;
    return store;
}))