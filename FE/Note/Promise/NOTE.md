#### 知识点
```
1. Promise接受的函数是同步执行的,但then是异步执行的  //demo1

2. Promise中的异常只要被处理了,后续的then方法将会执行成功的回调函数    //demo2

3. Js的异步任务分为macrotask和microtask2类  //demo3,4
micro-task先于macro-task执行,同一类异步任务则按照'该任务队列'的先进先出执行

macro-task: script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering
micro-task: process.nextTick, Promises(这里指浏览器实现的原生 Promise), Object.observe, MutationObserver

4.Promsie.resolve传入一个promise时,会直接返回这个prommise    //demo5

5. var promise1 = new Promise((resolve1,reject1)=>{   //demo6
    resolve1(promise2)    
}) 
//resolve本身的执行时是异步的
//当resolve中传入promise对象或者thenable对象时,会嵌套一层异步。
//因为会执行一次resolve1, 再执行一次resolve2或者reject2(后者用于改变promise2的状态) 


```

#### 相关资料

[Promise A+ 规范](http://www.ituring.com.cn/article/66566)

https://juejin.im/post/597724c26fb9a06bb75260e8

http://www.jianshu.com/p/12b9f73c5a4f

https://github.com/xieranmaya/blog/issues/3
