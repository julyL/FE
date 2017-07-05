//职责链模式
//bad
var order = function(orderType, pay, stock) {
    if (orderType === 1) { // 500 元定金购买模式
        if (pay === true) { // 已支付定金
            console.log('500 元定金预购, 得到 100 优惠券');
        } else { // 未支付定金，降级到普通购买模式
            if (stock > 0) { // 用于普通购买的手机还有库存
                console.log('普通购买, 无优惠券');
            } else {
                console.log('手机库存不足');
            }
        }
    } else if (orderType === 2) { // 200 元定金购买模式
        if (pay === true) {
            console.log('200 元定金预购, 得到 50 优惠券');
        } else {
            if (stock > 0) {
                console.log('普通购买, 无优惠券');
            } else {
                console.log('手机库存不足');
            }
        }
    } else if (orderType === 3) {
        if (stock > 0) {
            console.log('普通购买, 无优惠券');
        } else {
            console.log('手机库存不足');
        }
    }
};
order(1, true, 500); // 输出： 500 元定金预购, 得到 100 优惠券

//good
var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500 元定金预购，得到 100 优惠券');
    } else {
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};
var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200 元定金预购，得到 50 优惠券');
    } else {
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};
var orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，无优惠券');
    } else {
        console.log('手机库存不足');
    }
};
var Chain = function(fn) {
    this.fn = fn;
    this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor) {    // 设置下一个执行函数
    return this.successor = successor;
};
Chain.prototype.passRequest = function() {
    var ret = this.fn.apply(this, arguments);
    if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    }
    return ret;
};
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal=new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);
chainOrder500.passRequest(1, true, 500); // 输出：500 元定金预购，得到 100 优惠券
// 将原先代码(bad)中的if语句消除了
// 取而代之的是通过setNextSuccessor，将各个判断(order500,order200,orderNormal)函数串联起来,来实现if语句的效果
// 好处: 各个处理函数得到了分离,结构更加清晰。该需求时不再需要改if语句,只需调整相应的setNextSuccessor方法
// 上面代码的流程控制是 通过返回值return 'nextSuccessor'控制,无法处理异步的情况

// good的代码更接近与 面向对象语言的写法，下面利用js闭包实现更加简洁 (同样无法处理异步)
Function.prototype.after = function(fn) {
    var self = this;
    return function() {
        var ret = self.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }
        return ret;
    }
};
var order = order500yuan.after(order200yuan).after(orderNormal);  
order(1, true, 500); // 输出：500 元定金预购，得到 100 优惠券
//用 AOP 来实现职责链既简单又巧妙，但这种把函数叠在一起的方式，同时也叠加了函数的作用域，如果链条太长的话，也会对性能有较大的影响。

// 职责链模式的定义:使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
// 说白了: 一系列可能会处理请求的对象被连接成一条链，请求在这些对象之间依次传递，直到遇到一个可以处理它的对象

//异步的职责链  (有点像2-11 lazyman.js)
var Chain = function(fn) {
    this.fn = fn;
    this.successor = null;
};
Chain.prototype.next = function() {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
};
var fn1 = new Chain(function() {
    console.log(1);
    this.next();
});
var fn2 = new Chain(function() {
    var self = this;
    setTimeout(function() {
        console.log(2);
        self.next();
    }, 2000);
});
var fn3 = new Chain(function() {
    console.log(3);
    this.next();
});
Chain.prototype.setNextSuccessor=function(cb){
    this.successor=cb;
}
Chain.prototype.passRequest=function(){
    this.fn();
}
fn1.setNextSuccessor(fn2);
fn2.setNextSuccessor(fn3);
fn1.passRequest();

// 链式调用
Chain.prototype.setNextSuccessor=function(cb){
    return this.successor=cb;
}
fn1.setNextSuccessor( fn2 ).setNextSuccessor( fn3 ); 




















