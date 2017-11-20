#### simple-promise编码思路整理

```
Promise构造函数: 

核心逻辑如下 (executor为传入的函数)
    try {
        executor(resolve, reject)
    } catch (reason) {
        reject(reason)
    }
    
resolve: 异步执行成功队列onResolvedCallback中所有的函数  
reject: 异步执行失败队列onRejectedCallback中所有的函数

resolve和reject需要异步执行的原因: 
例如: new Promise((resolve,reject)=>{
    resolve(1);
}).then(re,rj)

then方法里面的re对应成功之后该做的事,re对应失败之后该做的事。
好比做一件事,需要事先告诉别人事成(resolved)和事败(rejected)之后该如何处理,然后别人干这件事时,才能根据成功或者失败的情况,马上做出相应的处理(re,rj)。
程序肯定不能等事情出了结果,再干巴巴的等着你告诉他如何处理(这样非常低效)。
```

```
promise2 = promise1.then(onFulfilled, onRejected); 
then方法:  根据promise1返回一个新的Promise对象promise2

执行then方法时promise1的状态有3种情况(resolved,rejected,pending)

resolved情况处理方法如下

    return promise2 = new Promise(function (resolve, reject) {
        setTimeout(function () {    // 异步?
            try {
                var x = onFulfilled(self.data)
                resolvePromise(promise2, x, resolve, reject)
            } catch (reason) {
                reject(reason)
            }
        })
    })
为什么要异步执行呢?
和上文中Promise构造函数内resolve异步执行的原因一样
先需要告诉promise2成功和失败的情况如何处理(通过then方法,详见resolvePromise),才能让pomise2状态变为resolved或rejected时知道如何处理

rejected情况处理方法同上

pending情况 就是把上面resolved情况和rejected情况的处理方法分别放入onResolvedCallback(成功队列)和onRejectedCallback(失败队列),待状态改变之后再触发队列中所有的函数

```

```
resolvePromise方法: 简单的讲就是根据x觉得promise2的状态

resolvePromise(promise2, x, resolve, reject)

x为执行promise1的onResolved(self.data) 返回值
resolve,reject为改变promise2状态的方法   //promise2 = new Promise(function (resolve, reject) 

```

```
虽然simple-promise通过了promises-aplus-tests simple-promise.js的测试
但是由于地方的处理和原生Promise还是存在差异的 例如: demo7

```



