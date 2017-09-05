/*
 * author: wendu
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 **/
!function (ob) {
    ob.hookAjax = function (funs) {
        window._ahrealxhr = window._ahrealxhr || XMLHttpRequest;    // 存储原生的XMLHttpRequest对象
        XMLHttpRequest = function () {         //重写xhr对象，当jquery等第三方库调用ajax时，实际上会采用这个xhr对象(ajax库也只是对于原生xhr对象进行封装而已)
            this.xhr = new window._ahrealxhr;
            for (var attr in this.xhr) {
                var type = "";
                try {
                    type = typeof this.xhr[attr]
                } catch (e) {}
                if (type === "function") {      // 如果是函数，就设置代理函数  如 open,setRequestHeader,send,abort，getResponseHeader，getAllResponseHeaders，overrideMimeType等
                    this[attr] = hookfun(attr);
                } else {
                    Object.defineProperty(this, attr, {    // 设置代理属性  responseText,onprogress，onload，onerror等
                        get: getFactory(attr),
                        set: setFactory(attr)
                    })
                }
            }
        }

        function getFactory(attr) {
            return function () {
                return attr.indexOf("on") != 0?this[attr + "_"] :this.xhr[attr]
            }
        }

        function setFactory(attr) {
            return function (f) {
                var xhr = this.xhr;
                var that = this;
                if (attr.indexOf("on") != 0) {   //如果不是 回调函数 onload,onerror等
                    this[attr + "_"] = f;        // 将回调属性的值存储起来
                    return;
                }
                if (funs[attr]) {       
                    xhr[attr] = function () {      // 设置代理函数 例如  xhr.onload
                        funs[attr](that) || f.apply(xhr, arguments);     // 先执行ajaxHook中设置的函数，如果返回值为false,则继续执行原生的回调
                        // that是 代理xhr对象        xhr是原生xhr对象
                    }
                } else {
                    xhr[attr] = f;
                }
            }
        }

        function hookfun(fun) {
            return function () {
                var args = [].slice.call(arguments)
                if (funs[fun] && funs[fun].call(this, args, this.xhr)) {   // ajaxHook设置的回调返回值true,就终止原生函数的执行
                    return;
                }
                return this.xhr[fun].apply(this.xhr, args);
            }
        }
        return window._ahrealxhr;
    }
    ob.unHookAjax = function () {
        if (window._ahrealxhr)  XMLHttpRequest = window._ahrealxhr;
        window._ahrealxhr = undefined;
    }
}(window)
//}(module.exports)
