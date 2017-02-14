function p(resolver) {
     this.state='pending';
     this.tasklist=[];
     var re=function(){p.resolve(this)}.bind(this),
         rj=function(){p.reject(this)}.bind(this);
     resolver(re,rj)
    
}

p.prototype.then = function(fn) {
    if(this.state=="resolve"){   //同步的情况, promise已经resolve
        fn();
    }else{
        this.tasklist.push(fn);
    }
}
p.prototype.catch = function() {}

p.resolve = function(pro) {
    pro.state="resolve";
    var task=pro.tasklist.shift();
    task&&task();
}

p.reject = function() {}
p.all = function() {}
p.race = function() {}

// 测试代码如下: 

// new p((re,rj)=>{
//     setTimeout(()=>{
//         console.log("task1: wait 2000");
//         re();
//     },1000)
// }).then(()=>{
//       console.log("task1 is finish");
//       return new p((re,rj)=>{
//             setTimeout(()=>{
//                 console.log("task2: wait 1000");
//                 re();
//             },1000)
//       });
// }).then(()=>{
//     console.log("task2 is finish");
// })



// new Promise((re,rj)=>{
//     setTimeout(()=>{
//         console.log("task1: wait 2000");
//         re();
//     },1000)
// }).then(()=>{
//       console.log("task1 is finish");
//       return new Promise((re,rj)=>{
//             setTimeout(()=>{
//                 console.log("task2: wait 3000");
//                 re();
//             },3000)
//       });
// }).then(()=>{
//     console.log("task2 is finish");
// })