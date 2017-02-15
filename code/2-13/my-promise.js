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
     this.value;
     this.tasklist=[];
     this.selfpromise=this;
     var re=function(resolveData){this.resolve(resolveData)}.bind(this),
         rj=function(resolveData){this.reject(resolveData)}.bind(this);
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
p.prototype.resolve = function(resolveData) {
    setTimeout(function(){
        this.state="resolve";
        //  取出tasklist队列第一个task执行
        //  如果task返回promise对象[A]，则将剩下未执行的tasklist作为[A]的执行队列
        //  如果是同步代码,[A]会先执行，但是执行时的tasklist还未指定。解决办法:是外面嵌套一层setTimout,之前认为不能这么做，会打乱普通代码的执行顺序。但执行测试6,发现官方好像就是这么处理的

        var task=this.tasklist.shift(),
            returndata;
        if(task){
            returndata=task(resolveData);          //
            if(isPromise(returndata)){         
                returndata.tasklist=this.tasklist;
            }else{
                this.resolve(resolveData);
            }
        }  
    }.bind(this),0)
}
//测试0
var P=new p((re,rj)=>{
    setTimeout(()=>{
        console.log("task1: wait 2000");
        re("data1");
    },1000)
}).then((data)=>{
      console.log(data);
      console.log("task1 is finish");
});
//测试1
// var P=new p((re,rj)=>{
//     setTimeout(()=>{
//         console.log("task1: wait 2000");
//         re("data1");
//     },1000)
// }).then((data)=>{
//       console.log("task1 is finish");
//       console.log("data:",data);
//       return new p((re,rj)=>{
//             setTimeout(()=>{
//                 console.log("task2: wait 1000");
//                 re("data2");
//             },1000)
//       });
// }).then((data)=>{
//     console.log("task2 is finish");
//     console.log("data:",data);
// })

//测试2
// var P=new p((re,rj)=>{
//     setTimeout(()=>{
//         console.log("task1: wait 2000");
//         re();
//     },1000)
// }).then(()=>{
//       console.log("task1 is finish");
//       return new p((re,rj)=>{
//                 console.log("task2: wait 1000");
//                 re();
//       });
// }).then(()=>{
//     console.log("task2 is finish");
// })


//测试6
// var a=new Promise((re)=>{
//     console.log(1);
//     re();
// })
// a.then(()=>{
//     console.log(2);
// })
// console.log(3)
//   1  3  2