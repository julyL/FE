setTimeout(function() {
    console.log('timeout1');
})

new Promise(function(resolve) {
    console.log('promise1');
    for(var i = 0; i < 1000; i++) {
        i == 99 && resolve();
    }
    console.log('promise2');
}).then(function() {
    console.log('then1');
})

console.log('global1');
/*
promise1
promise2
global1
then1           Promise的then是微任务, setTimeout是宏任务
timeout1
 */


//例1   
new Promise(function(resolve) {
    console.log('glob1_promise');
    resolve();
}).then(function() {
    console.log('glob1_then')
})

process.nextTick(function() {
    console.log('glob1_nextTick');
})

process.nextTick(function() {
    console.log('glob2_nextTick');
})
new Promise(function(resolve) {
    console.log('glob2_promise');
    resolve();
}).then(function() {
    console.log('glob2_then')
})

/*
glob1_promise
glob2_promise
glob1_nextTick
glob2_nextTick
glob1_then
glob2_then
 */
