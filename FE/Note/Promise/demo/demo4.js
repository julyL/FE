new Promise(function (resolve) {
    console.log('glob1_promise');
    resolve();
}).then(function () {
     console.log('glob1_then')
})

process.nextTick(function () {
    console.log('glob1_nextTick');
})

process.nextTick(function () {
    console.log('glob2_nextTick');
})
new Promise(function (resolve) {
    console.log('glob2_promise');
    resolve();
}).then(function () {
     console.log('glob2_then')
})

/*
process.nextTick和原生Promise都是micro-task, 
这里processs.nextTick方法都是先于then方法的执行(process.nextTick本身不是异步,回调是异步的。then方法本身就是异步执行的),
先进入micro-task的任务队列,所以先执行。

glob1_promise
glob2_promise
glob1_nextTick
glob2_nextTick
glob1_then
glob2_then
 */
