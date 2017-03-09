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

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);
chainOrder500.passRequest(1, true, 500); // 输出：500 元定金预购，得到 100 优惠券


//better
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


//异步的职责链  (有点像2-11 lazyman.js)
Chain.prototype.next = function() {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
};
var fn1 = new Chain(function() {
    console.log(1);
    return 'nextSuccessor';
});
var fn2 = new Chain(function() {
    console.log(2);
    var self = this;
    setTimeout(function() {
        self.next();
    }, 1000);
});
var fn3 = new Chain(function() {
    console.log(3);
});
fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();
























