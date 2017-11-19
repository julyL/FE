/*
  源代码出处: https://github.com/xieranmaya/blog/issues/3
*/
try {
    module.exports = Promise
} catch (e) {}

function Promise(executor) {
    var self = this

    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        setTimeout(function () {    // 异步执行所有的回调函数
            if (self.status === 'pending') {
                self.status = 'resolved'
                self.data = value
                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        })
    }

    function reject(reason) {
        setTimeout(function () {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason
                for (var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](reason)
                }
            }
        })
    }

    try {
        executor(resolve, reject)
    } catch (reason) {
        reject(reason)
    }
}

function resolvePromise(promise2, x, resolve, reject) {   // 对应文档 [[Resolve]](promise,x) 
    // promise2 = promise1.then(onFulfilled, onRejected);  resolve和reject用于改变promise2的状态
    var then
    var thenCalledOrThrow = false

    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    if (x instanceof Promise) {
        if (x.status === 'pending') {
        /*
        需要注意,执行x的成功方法，并不能简单的执行resolve将promise2的状态定为resolved
        例如 x = new Promise((resolve,reject)=>{
            resolve([里面的值可能为promise对象或者thenable对象])  //虽然x执行resolve方法,但是 x的状态还是要根据resolve里面的值来进行判断
        })

        */
            x
                .then(function (v) {
                    resolvePromise(promise2, v, resolve, reject)
                }, reject)
        } else { //  已经确定状态时，执行相应的resolve或者rejecct即可
            x.then(resolve, reject)
        }
        return
    }

    if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
        // 如果x.then为function ,则根据x来决定promise2的状态(通过x.then方法)
        try {
            then = x.then //because x.then could be a getter
            if (typeof then === 'function') {
                then
                    .call(x, function rs(y) { // y为x执行时resolve返回的值
                        if (thenCalledOrThrow) 
                            return
                        thenCalledOrThrow = true
                        return resolvePromise(promise2, y, resolve, reject)
                    }, function rj(r) {
                        if (thenCalledOrThrow) 
                            return
                        thenCalledOrThrow = true
                        return reject(r)
                    })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (thenCalledOrThrow) 
                return
            thenCalledOrThrow = true
            return reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.prototype.then = function (onResolved, onRejected) {
    var self = this,
        promise2;
    onResolved = typeof onResolved === 'function' // 不是函数时，默认返回一个函数(函数内部把上一个promise返回的value传给下个promise)
        ? onResolved
        : function (v) {
            return v
        }
    onRejected = typeof onRejected === 'function'
        ? onRejected
        : function (r) {
            throw r
        }
    if (self.status === 'resolved') {
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () { // 异步执行onResolved
                try {
                    var x = onResolved(self.data)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })
    }
    if (self.status === 'rejected') {
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () { // 异步执行onRejected
                try {
                    var x = onRejected(self.data)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })
    }
    if (self.status === 'pending') {
        // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
        return promise2 = new Promise(function (resolve, reject) {
            self
                .onResolvedCallback
                .push(function (value) {
                    try {
                        var x = onResolved(value)
                        resolvePromise(promise2, x, resolve, reject) // promise2的状态会根据x来定
                    } catch (r) {
                        reject(r)
                    }
                })
            self
                .onRejectedCallback
                .push(function (reason) {
                    try {
                        var x = onRejected(reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (r) {
                        reject(r)
                    }
                })
        })
    }
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

Promise.deferred = Promise.defer = function () {
    var dfd = {}
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
