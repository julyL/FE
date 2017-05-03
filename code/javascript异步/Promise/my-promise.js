/*
    author: julyL
    照规范试图写的一个Promise库 
    规范地址：http://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plus/

    全局安装
        npm i -g promises-aplus-tests
    运行测试
         promises-aplus-tests my-promise.js
    ( 2.2.4, 2.2.6, 2.3.3测试未通过)
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Promise = factory());
}(this, function() {
    function isFunction(val) {
        return typeof val == 'function';
    }

    function isObject(val) {
        return typeof val == 'object';
    }

    function asyncExcute(fn) {
        return function() {
            var context = this,
                args = arguments;
            setTimeout(function() {
                fn.apply(context, args);
            },0); // 同一执行队列中,原生Promise是先于setTimeout实现的,自己实现暂时用setTimeout模拟
        }
    }

    function Promise(fn) {
        if (!isFunction(fn) || this instanceof Promise == false) {
            throw new TypeError("Promise必须传入function并且new构造")
        }
        this.status = 'pending';
        this.value = undefined; //  promise状态改变之后传递的值
        this.thenPromise = undefined; //执行then之后返回的promise
        this.resolveQueue = []; //
        this.rejectQueue = []; //   
        var re = asyncExcute(function(resolveData) { this._resolve(resolveData) }.bind(this)), //这里必须异步处理,否则then函数执行以前可能就已经执行了_resolve,但这时then中函数还未加入resolveQueue中
            rj = asyncExcute(function(resolveData) { this._reject(resolveData) }.bind(this));
        try {
            fn(re, rj)
        } catch (error) {
            this.status = 'reject';
            this.value = error;
            asyncExcute(function() { this._reject(error) }); //  new Promise(()=>{ 出现异常... }).then(refn,rjfn);    出现异常时then还未执行, rjfn还未加入到rejectQueue中  
        }
    }
    Promise.prototype.catch = function(rjfn) {
        return this.then(null, rjfn)
    }
    Promise.prototype.then = function(refn, rjfn) {
            var returnPro = new Promise(function() {});
            this.thenPromise = returnPro;
            this.resolveQueue.push(refn);
            this.rejectQueue.push(rjfn);

            if (this.status == 'resolve') { //执行then时,如果状态已经不是pending,则执行相应函数
                this._resolve(this.value);
            }
            if (this.status == 'reject') {
                this._reject(this.value);
            }
            return returnPro;
        }
        //  promise2 = promise1.then(onFulfilled, onRejected);
    Promise.prototype._resolve = function(resolveData) {
        var handle,
            returnVal;
        this.status = "resolve";
        this.value = resolveData;
        while (this.resolveQueue.length > 0) { //2.2.6  当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
            handle = this.resolveQueue.shift();
            if (!isFunction(handle)) { //如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
                this.thenPromise.value = resolveData;
                this.thenPromise.status = 'resolve';
                this.thenPromise._resolve(resolveData);
                return;
            }
            try { //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                returnVal = handle(resolveData);
            } catch (error) {
                this.thenPromise.status = 'reject';
                this.thenPromise.value = error;
                this.thenPromise._reject(error);
                return;
            }
            if (isObject(returnVal || isFunction(returnVal))) { //如果返回值为对象或者函数
                if (returnVal == this.thenPromise) { //如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
                    this.thenPromise.status = 'reject';
                    this.thenPromise.value = new TypeError('[[Resolve]](promise, x),promise 和 x 不能指向同一对象');
                } else if (returnVal instanceof Promise) { //如果 x 为 Promise ，则使 promise 接受 x 的状态
                    try {
                        returnVal.then(this.thenPromise._resolve.bind(this.thenPromise), this.thenPromise._reject.bind(this.thenPromise));
                    } catch (error) {
                        this.thenPromise.status = 'reject';
                        this.thenPromise.value = error;
                        this.thenPromise._reject(error);
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
                        this.thenPromise._reject(error);
                    }
                }
            } else {
                this.thenPromise.value = returnVal;
                this.thenPromise.status = 'resolve';
                this.thenPromise._resolve(returnVal);
            }
        }
    }

    Promise.prototype._reject = function(resolveData) {
        var handle,
            returnVal;
        this.status = "resolve";
        this.value = resolveData;
        while (this.rejectQueue.length > 0) { //2.2.6  当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
            handle = this.rejectQueue.shift();
            if (!isFunction(handle)) { //如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
                this.thenPromise.value = resolveData;
                this.thenPromise.status = 'reject';
                this.thenPromise._reject(resolveData);
                return;
            }
            try { //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                returnVal = handle(resolveData);
            } catch (error) {
                this.thenPromise.status = 'reject';
                this.thenPromise.value = error;
                this.thenPromise._reject(error);
                return;
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
                        this.thenPromise._reject(error);
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
                        this.thenPromise._reject(error);
                    }
                }
            } else {
                this.thenPromise.value = returnVal;
                this.thenPromise.status = 'resolve';
                this.thenPromise._resolve(returnVal);
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
    // 测试
    Promise.deferred = Promise.defer = function() {
        var dfd = {}
        dfd.promise = new Promise(function(resolve, reject) {
            dfd.resolve = resolve;
            dfd.reject = reject;
        })
        return dfd
    }
    return Promise;
}));

/*
测试1:
var a=new Promise(function(re,rj){
  setTimeout(function(){
    re(1);
  },2000)
}).then(function(data){
  console.log("after2000",data)
  return  new Promise(function(re){
    setTimeout(function(){
        re(2);
    },2000)
  })
}).then(function(data){
  console.log("after4000",data)
  console.l(error);
}).catch(function(error){
    console.log(error);
})


测试2:
var a=new Promise(function(re,rj){
  setTimeout(function(){
    rj(1);
  },2000)
}).then(function(data){
  console.log("promise2 resolve",data)
}).catch(function(error){
    console.log("finally catch error is:",error);
});

a.then(function(){
    console.log("end");
})


 */
