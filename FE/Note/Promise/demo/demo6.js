var p1 = Promise.resolve(1);
var p2 = Promise.resolve(p1);  

var p4 = new Promise(function (resolve, reject) {
    resolve(p1);
});

p4.then(function (value) {
    console.log('p4=' + value);
});

p2.then(function (value) {
    console.log('p2=' + value);
})

console.log('p3');

p1.then(function (value) {
    console.log('p1=' + value);
})

/*
浏览器中的结果:

p3
p2=1
p1=1
p4=1

解释:

then方法里面的函数是异步的,所以p3在先

p2 === p1, p2的then先于p1执行

p4虽然第一个执行,但是resolve中需要处理p1(resolve处理promise对象或者thenable是异步的)  异步里面又嵌套了一层异步,所以最后执行

ps: node里面的顺序如下 (不懂?)

p3
p4=1
p2=1
p1=1

 */
