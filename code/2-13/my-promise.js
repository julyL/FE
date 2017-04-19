(function(global) {
    function isFunction(val) {
        return typeof val == 'function';
    }

    function isObject(val) {
        return typeof val == 'object';
    }

    function asyncExcute(fn) {
        return function() {
            setTimeout(fn); // 同一执行队列中,原生Promise是先于setTimeout实现的,自己实现暂时用setTimeout模拟
        }
    }

    function Promise(fn) {
        if (!isFunction(fn) || this instanceof Promise == false) {
            throw new TypeError("Promise必须传入function并且new构造")
        }
        this.state = 'pending';
        this.value = undefined;
        this.resolveQueue = [];
        this.rejectQueue = [];
        this.thenPromise = undefined;
        var re = asyncExcute(function(resolveData) { this._resolve(resolveData) }.bind(this)), //这里必须异步处理,否则then函数执行以前可能就已经执行了re
            rj = asyncExcute(function(resolveData) { this._reject(resolveData) }.bind(this));
        try {
            fn(re, rj)
        } catch (error) {
            this.state = 'reject';
            this.value = error;
        }
    }
    Promise.prototype.then = function(refn, rjfn) {
        var returnPro = new Promise(function() {});
        this.thenPromise = returnPro;
        this.resolveQueue.push(refn);
        this.rejectQueue.push(rjfn);
        return returnPro;
    }
    Promise.prototype._resolve = function(resolveData) {
        var handle,
            returnVal;
        if (this.status != "resolve" && this.status != "reject") { //在 promise 执行结束前其不可被调用
            this.status = "resolve";
            this.value = resolveData;
            while (this.resolveQueue.length > 0) { //2.2.6  当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
                handle = this.resolveQueue.shift();
                if (!isFunction(handle)) { //不是函数  2.1.1 onFulfilled 不是函数，其必须被忽略
                    this.thenPromise.value = resolveData;
                    this.thenPromise.status = 'resolve';
                    this.thenPromise._resolve();
                    return;
                }
                try { //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                    returnVal = handle(resolveData);
                } catch (error) {
                    this.thenPromise.status = 'reject';
                    this.thenPromise.value = error;
                    this.thenPromise._reject();
                }
                if (isObject(returnVal || isFunction(returnVal))) { //如果返回值为对象或者函数
                    if (returnVal == this.thenPromise) { //如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
                        this.thenPromise.status = 'reject';
                        this.thenPromise.value = new TypeError('[[Resolve]](promise, x),promise 和 x 不能指向同一对象');
                    } else if (returnVal instanceof Promise) { //如果 x 为 Promise ，则使 promise 接受 x 的状态
                        try {
                            then.call(returnVal, this.thenPromise._resolve.bind(this.thenPromise), this.thenPromise._reject.bind(this.thenPromise));
                        } catch (error) {
                            this.thenPromise.status = 'reject';
                            this.thenPromise.value = error;
                            this.thenPromise._reject();
                        }
                    } else { //如果 x 为对象或者函数
                        try { //如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                            var then = returnVal.then;
                            if (isFunction(then)) {
                                then.call(returnVal, this.thenPromise._resolve.bind(this.thenPromise), this.thenPromise._reject.bind(this.thenPromise));
                            }
                        } catch (error) {
                            this.thenPromise.status = 'reject';
                            this.thenPromise.value = error;
                            this.thenPromise._reject();
                        }
                    }
                } else {
                    this.thenPromise.value = returnVal;
                    this.thenPromise.status = 'resolve';
                    this.thenPromise._resolve();
                }

            }
        }
    }
    Promise.prototype._reject = function(resolveData) {
        var handle,
            returnVal;
        if (this.status != "resolve" && this.status != "reject") { //在 promise 执行结束前其不可被调用
            this.status = "resolve";
            this.value = resolveData;
            while (this.rejectQueue.length > 0) { //2.2.6  当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
                handle = this.rejectQueue.shift();
                if (!isFunction(handle)) { //不是函数  2.1.1 onFulfilled 不是函数，其必须被忽略
                    this.thenPromise.value = resolveData;
                    this.thenPromise.status = 'resolve';
                    this.thenPromise._resolve();
                    return;
                }
                try { //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                    returnVal = handle(resolveData);
                } catch (error) {
                    this.thenPromise.status = 'reject';
                    this.thenPromise.value = error;
                    this.thenPromise._reject();
                }
                if (isObject(returnVal || isFunction(returnVal))) { //如果返回值为对象或者函数
                    if (returnVal == this.thenPromise) { //如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
                        this.thenPromise.status = 'reject';
                        this.thenPromise.value = new TypeError('[[Resolve]](promise, x),promise 和 x 不能指向同一对象');
                    } else if (returnVal instanceof Promise) { //如果 x 为 Promise ，则使 promise 接受 x 的状态
                        try {
                            then.call(returnVal, this.thenPromise._resolve.bind(this.thenPromise), this.thenPromise._reject.bind(this.thenPromise));
                        } catch (error) {
                            this.thenPromise.status = 'reject';
                            this.thenPromise.value = error;
                            this.thenPromise._reject();
                        }
                    } else { //如果 x 为对象或者函数
                        try { //如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                            var then = returnVal.then;
                            if (isFunction(then)) {
                                then.call(returnVal, this.thenPromise._resolve.bind(this.thenPromise), this.thenPromise._reject.bind(this.thenPromise));
                            }
                        } catch (error) {
                            this.thenPromise.status = 'reject';
                            this.thenPromise.value = error;
                            this.thenPromise._reject();
                        }
                    }
                } else {
                    this.thenPromise.value = returnVal;
                    this.thenPromise.status = 'resolve';
                    this.thenPromise._resolve();
                }

            }
        }
    }
    Promise.resolve = function(value) {
        return new Promise(function(re, rj) {
            re(value)
        })
    }
    Promise.reject = function(value) {
        return new Promise(function(re, rj) {
            re(value)
        })
    }
    Promise.all = function(queue) {
        if (Object.prototype.toString.call(queue) != "[object Array]") {
            return;
        }
        var returnPromise = new Promise(function() {}),
            resolveNum = 0;
        for (var i = 0; i < queue.length; i++) {
            queue[i].then(function() {
                resolveNum++;
                if (resolveNum == queue.length) {
                    returnPromise._resolve();
                }
            });
        }
        return returnPromise;
    }
    Promise.race = function(queue) {
        if (Object.prototype.toString.call(queue) != "[object Array]") {
            return;
        }
        var returnPromise = new Promise(function() {}),
            resolveNum = 0;
        for (var i = 0; i < queue.length; i++) {
            queue[i].then(function() {
                returnPromise._resolve();
            });
        }
        return returnPromise;
    }
    global.Promise = Promise;
})(window);
