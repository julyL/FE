var originLog = console.log;
var log = function (arguments) {
    originLog.call(console, new Date().getSeconds() + "\n", arguments)
}
var wait = function (time, resolveData) {
    return new ES6Promise((resolve, reject) => {
        setTimeout(() => {
            log("execute wait:" + time)
            resolve(resolveData);
        }, time)
    })
}

log('start')

new ES6Promise((resolve, reject) => {
    setTimeout(() => {
        log("then0");
        resolve(wait(2000));
    }, 3000)
}).then(v=>{
    console.log(v);
})

// new ES6Promise((resolve, reject) => {
//     setTimeout(() => {
//         log("then0");
//         resolve(wait(1000));
//     }, 3000)
// }).then(v => {
//     log('then1');
//     return wait(2000)
// }).then(v => {
//     log('then2');
//     return wait(3000, wait(5000))
// }).then(v => {
//     log('then3');
// })