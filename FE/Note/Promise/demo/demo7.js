var originLog = console.log;
var log = function (arguments) {
    originLog.call(console, new Date().getSeconds() + "\n", arguments)
}
var wait = function (time, resolveData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            log("execute wait:" + time)
            resolve(resolveData);
        }, time)
    })
}
log('start')
new Promise((resolve, reject) => {
    setTimeout(() => {
        log("then0");
        resolve(wait(1000));
    }, 3000)
}).then(v => {
    log('then1');
    return wait(2000)
}).then(v => {
    log('then2');
    return wait(3000, wait(5000))
}).then(v => {
    log('then3');
})
/*
Chrome下原生promise测试:
start
(3s之后)
then0
(1s之后)
then1
(2s之后)
then2
(5s之后)

simple-promise执行结果:
start
(3s之后)
then0
then1
(2s之后)
then2
(5s之后)
then3
*/
