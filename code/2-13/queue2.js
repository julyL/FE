//  js 执行顺序  http://www.jianshu.com/p/12b9f73c5a4f

// demo02
console.log('1');
setTimeout(function() {
    console.log('5');
    var timer = setInterval(function() {
        console.log("5.1")
        clearInterval(timer);
    }, 0)
    setTimeout(function() {
        console.log('5.2')
    })
    new Promise(function(resolve) {
        console.log('5.3');
        resolve();
    }).then(function() {
        console.log('5.4')
    })
    process.nextTick(function() {
        console.log('5.5');
    })
});

setTimeout(function() {
    console.log('6');
    process.nextTick(function() {
        console.log('6.1');
    })
    new Promise(function(resolve) {
        console.log('6.2');
        resolve();
    }).then(function() {
        console.log('6.3')
    })
})
process.nextTick(function() {
    console.log('3');
    process.nextTick(function() {
        console.log('3.1');
        process.nextTick(function() {    //嵌套队列，外层process队列执行完再执行
            console.log('3.2');
        });
    });
})
new Promise(function(resolve) {
    console.log('p2');
    resolve();
}).then(function() {
    console.log('p2then')
})

process.nextTick(function() {
    console.log('4');
    process.nextTick(function() {
        console.log('4.2');
    });
    new Promise(function(resolve) {
        console.log('4.3');
        resolve();
    }).then(function() {
        console.log('4.4')   //这里属于嵌套队列，需要等待外层promise队列执行完再执行
    })

})
new Promise(function(resolve) {
    console.log('p3');
    resolve();
}).then(function() {
    console.log('p3then')
})

/*
1
p2
p3
    3
    4
    4.3
        3.1
        4.2
            3.2
                p2then
                p3then
                4.4
                            5
                            5.3
                            6
                            6.2
                                    5.5
                                    6.1
                                            5.4
                                            6.3
                                                    5.1 
                                                    5.2
执行过程:                                                  
  [1,p2,p3]  =>  [3,4,4.3]  =>[3.1,4.2]  =>[3.2]
  =>[p2then,p3then,4.4]  => [5,5.3,6,6.2] =>[5.5,6,1] =>[5.4,6.3] =>[5.1,5.2]

  总结:  先执行从上到下  正常队列   -->  执行微任务队列(优先级nextTick >Promise) ->执行宏任务队列(setTimeout==setInterval)
  如有嵌套队列， 则重复以上操作直至所有队列为空
 */
