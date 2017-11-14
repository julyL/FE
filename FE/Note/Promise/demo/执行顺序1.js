console.log(1);
setTimeout(function() {
    console.log('5');
    new Promise(function(resolve) {
        console.log("6");
        resolve();
    }).then(function() {
        console.log("7");
        setTimeout(function(){
        	console.log('10')
        })
    })
    console.log("6.1");
    setTimeout(function() {
        console.log("9")
    })
})

new Promise(function(resolve) {
    console.log('2');
    resolve();
}).then(function() {
    console.log('3');
    setTimeout(function() {
        console.log("8")
    });
    new Promise(function(resolve) {
        resolve();
    }).then(function() {
        console.log("4");
        new Promise(function(resolve) {
            resolve();
        }).then(function() {
            console.log("4.1");
            setTimeout(function(){
            	console.log("8.1")
            })
        })
    })
});
new Promise(function(resolve) {
    resolve();
}).then(function() {
	console.log('3.1');
})



// 输出结果从小到大
// setTimeout和Promise 者的各自维护一个执行队列, Promise的队列优先于setTimeout执行