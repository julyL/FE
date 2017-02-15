p.reject = function() {}
p.all = function() {}
p.race = function() {}
p.prototype.catch = function() {}
function isPromise(val){
     return val instanceof p;
}
function run(tasklist){

}
function p(resolver) {
     this.state='pending';
     this.tasklist=[];
     this.selfpromise=this;
     var re=function(){p.resolve(this)}.bind(this),
         rj=function(){p.reject(this)}.bind(this);
     resolver(re,rj)
    
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
p.resolve = function(pro) {
    pro.state="resolve";
    //  取出tasklist队列第一个task执行
    //  如果task返回promise对象[A]，则将剩下未执行的tasklist作为[A]的执行队列
    //  如果是同步代码,[A]会先执行，但是执行时的tasklist还未指定。解决：只能在resolve执行之前就指定tasklist
    var task=pro.tasklist.shift(),
        returndata;
    if(task){
        returndata=task();
        if(isPromise(returndata)){
            returndata.tasklist=pro.tasklist;
        }else{
            p.resolve(pro);
        }
    }  
}
// var P=new p((re,rj)=>{
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

//同步测试失败
console.log('同步测试');
var P=new p((re,rj)=>{
    setTimeout(()=>{
        console.log("task1: wait 2000");
        re();
    },1000)
}).then(()=>{
      console.log("task1 is finish");
      return new p((re,rj)=>{
                console.log("task2: wait 1000");
                re();
      });
}).then(()=>{
    console.log("task2 is finish");
})


