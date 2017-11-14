new Promise(function (re, rj) {
    rj(1);
}).then(() => {
    console.log('re');
}, () => {
    console.log("rj");
}).then(() => {
    console.log('then re');
})
/**
  Promise中的异常只要被处理了,后续的then方法将会执行成功的回调函数
  
  promise2 = promise1.then(onFulfilled, onRejected);
  不论 promise1 被 reject 还是被 resolve 时 promise2 都会被 resolve，只有出现异常时才会被 rejected

 */