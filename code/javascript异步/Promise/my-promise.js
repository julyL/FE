/*
    author: julyL
    照规范试图写的一个Promise库 
    规范地址：http://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plus/

    全局安装
        npm i -g promises-aplus-tests
    运行测试
         promises-aplus-tests my-promise.js
    ( 2.2.4, 2.2.6, 2.3.1,2.3.2 ,2.3.3测试未通过)
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
            }, 0); // 同一执行队列中,原生Promise是先于setTimeout实现的,自己实现暂时用setTimeout模拟
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
            var returnPro = new Promise(function() {}),
                returnVal;
            this.thenPromise = returnPro;

            if (this.status == 'resolve') { //执行then时,如果状态已经不是pending,则执行相应函数
                setTimeout(function() {
                    try {
                        returnVal = refn(this.value);
                        ResolvePromise(this.thenPromise, returnVal);
                    } catch (error) {
                        this.thenPromise._reject(error);
                    }
                }.bind(this));
            }
            if (this.status == 'reject') {
                setTimeout(function() {
                    try {
                        returnVal = rjfn(this.value);
                        ResolvePromise(this.thenPromise, returnVal);
                    } catch (error) {
                        this.thenPromise._reject(error);
                    }
                }.bind(this));
            }
            if (this.status == 'pending') {
                this.resolveQueue.push(refn);
                this.rejectQueue.push(rjfn);
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
            try {
                returnVal = handle(resolveData);
                ResolvePromise(this.thenPromise, returnVal)
            } catch (error) {
                this.thenPromise.value = error;
                this.thenPromise.status = 'reject';
                this.thenPromise._reject(error);
            }
        }
    }

    function ResolvePromise(thenPromise, x) {
        var thenCalledOrThrow = false;
        if (isObject(x || isFunction(x))) { //如果返回值为对象或者函数
            if (x == thenPromise) { //如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
                thenPromise.status = 'reject';
                var error = new TypeError('[[Resolve]](promise, x),promise 和 x 不能指向同一对象');
                thenPromise.value = error;
                thenPromise._reject(error);
            } else if (x instanceof Promise) { //如果 x 为 Promise ，则使 promise 接受 x 的状态
                try {
                    if (x.status == 'pending') {
                        x.then(function(v) {
                            ResolvePromise(thenPromise, v)
                        }, thenPromise._reject)
                    } else {
                        x.then(thenPromise._resolve, thenPromise._reject)
                    }
                } catch (error) {
                    thenPromise.status = 'reject';
                    thenPromise.value = error;
                    thenPromise._reject(error);
                }
            } else { //如果 x 为对象或者函数
                try { //如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                    var then = x.then;
                    if (isFunction(then)) {
                        x.then(function(y) {
                            if (thenCalledOrThrow) return;
                            thenCalledOrThrow = true;
                            return ResolvePromise(thenPromise, y, thenPromise._resolve, thenPromise._reject)
                        }, function(error) {
                            if (thenCalledOrThrow) return;
                            thenCalledOrThrow = true;
                            thenPromise._reject(error);
                        });
                    } else {
                        thenPromise.value = x;
                        thenPromise.status = 'resolve';
                        thenPromise._resolve(x);
                    }
                } catch (error) {
                    thenPromise.status = 'reject';
                    thenPromise.value = error;
                    thenPromise._reject(error);
                }
            }
        } else {
            thenPromise.value = x;
            thenPromise.status = 'resolve';
            thenPromise._resolve(x);
        }
    }
    Promise.prototype._reject = function(resolveData) {
        var handle,
            returnVal;
        this.status = "resolve";
        this.value = resolveData;
        while (this.rejectQueue.length > 0) { //2.2.6  当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
            handle = this.rejectQueue.shift();
            if (!isFunction(handle)) {
                this.thenPromise.value = resolveData;
                this.thenPromise.status = 'resolve';
                this.thenPromise._reject(resolveData);
                return;
            }
            try {
                returnVal = handle(resolveData);
                ResolvePromise(this.thenPromise, returnVal)
            } catch (error) {
                this.thenPromise.value = error;
                this.thenPromise.status = 'reject';
                this.thenPromise._reject(error);
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
    console.error("catch:"+error);
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
