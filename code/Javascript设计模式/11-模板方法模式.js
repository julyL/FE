var Beverage = function(param) {
    var boilWater = function() {
        console.log('把水煮沸');
    };
    var brew = param.brew || function() {
        throw new Error('必须传递 brew 方法');
    };
    var pourInCup = param.pourInCup || function() {
        throw new Error('必须传递 pourInCup 方法');
    };
    var addCondiments = param.addCondiments || function() {
        throw new Error('必须传递 addCondiments 方法');
    };
    var F = function() {};
    F.prototype.init = function() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };
    return F;
};
var Coffee = Beverage({
    brew: function() {
        console.log('用沸水冲泡咖啡');
    },
    pourInCup: function() {
        console.log('把咖啡倒进杯子');
    },
    addCondiments: function() {
        console.log('加糖和牛奶');
    }
});
var Tea = Beverage({
    brew: function() {
        console.log('用沸水浸泡茶叶');
    },
    pourInCup: function() {
        console.log('把茶倒进杯子');
    },
    addCondiments: function() {
        console.log('加柠檬');
    }
});
var coffee = new Coffee();
coffee.init();
var tea = new T();
tea.init();

//  Beverage方法是模板方法，该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法
//   子类只关注于如何实现具体的方法，具体的调用由  "模板方法" 决定

//模板方法模式是好莱坞原则(不要来找我，我会给你打电话)的一个典型使用场景，它与好莱坞原则的联系非常明显，当我们用模板方法模式编写一个程序时，就意味着子类放弃了对自己的控制权，而是改为父类通知子类，哪些方法应该在什么时候被调用。作为子类，只负责提供一些设计上的细节