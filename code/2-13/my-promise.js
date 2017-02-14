function p(resolver) {
     this.state='pending';
     this.tasklist=[];
     this.selfpromise=this;
     var re=function(){p.resolve(this)}.bind(this),
         rj=function(){p.reject(this)}.bind(this);
     resolver(re,rj)
    
}
function isPromise(val){
     return val instanceof p;
}
function run(tasklist){


}
p.prototype.then = function(fn) {
    if(this.state=="resolve"){   //同步的情况, promise已经resolve
        var pro=fn();
        if(isPromise(pro)){
            this.selfpromise=pro;
        } 
    }else{
        this.tasklist.push(fn);
    }
    return this;
}
p.prototype.catch = function() {}

p.resolve = function(pro) {
    pro.state="resolve";
    //  按tasklist队列执行task,
    //  如果task返回promise对象，则将剩下未执行的tasklist作为这个promise对象resolve时的执行队列
    
    
}

p.reject = function() {}
p.all = function() {}
p.race = function() {}

var P=new p((re,rj)=>{
    setTimeout(()=>{
        console.log("task1: wait 2000");
        re();
    },1000)
}).then(()=>{
      console.log("task1 is finish");
      return new p((re,rj)=>{
            setTimeout(()=>{
                console.log("task2: wait 1000");
                re();
            },1000)
      });
}).then(()=>{
    console.log("task2 is finish");
})

// 同步测试
// var P=new p((re,rj)=>{
//         console.log("task1: wait 2000");
//         re();
// }).then(()=>{
//       console.log("task1 is finish");
//       return new p((re,rj)=>{
//                 console.log("task2: wait 1000");
//                 re();
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