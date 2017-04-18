function isFunction(val){
    return typeof val=='function';
}
function isObject(val){
    return typeof val=='object';
}

function pro(fn) {
     this.state='pending';
     this.value=null;
     this.resolveQueue=[];
     this.rejectQueue=[];
     this.thenPromise=null;
     var re=function(resolveData){this._resolve(resolveData)}.bind(this),
         rj=function(resolveData){this._reject(resolveData)}.bind(this);
         if(isFunction(fn)){
             fn(re,rj) 
         }
     
}
pro.prototype.then = function(refn,rjfn) {
    var returnPro=new pro();
    this.thenPromise=returnPro;
    this.resolveQueue.push(refn);
    this.rejectQueue.push(rjfn);
    return returnPro;
}
pro.prototype._resolve = function(resolveData) {
    var handle,
        returnVal;
    if(this.status!="resolve"&&this.status!="reject"){
        this.status="resolve";
        this.value=resolveData;
        while(this.resolveQueue.length>0){    //2.2.6  当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
            handle=this.resolveQueue.shift();
            if(!isFunction(handle)){            //不是函数  2.1.1 onFulfilled 不是函数，其必须被忽略
                this.thenPromise.value=resolveData;
                this.thenPromise.status='resolve';
                return;
            }
            try {       //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                returnVal=handle(resolveData);
                console.log('reVal',returnVal)
            }catch(error){
                this.thenPromise.status='reject';
                this.thenPromise.value=error;
            }
            if(isObject(returnVal||isFunction(returnVal))){  //如果返回值为对象或者函数
                if(returnVal==this.thenPromise){  //如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
                    this.thenPromise.status='reject';
                    this.thenPromise.value=new Error('TypeError');
                }else if(0){  //如果 x 为 Promise ，则使 promise 接受 x 的状态

                }else{   //如果 x 为对象或者函数
                    try{    //如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                         var then=returnVal.then;
                         if(isFunction(then)){
                            then.call(returnVal,this.thenPromise._resolve,this.thenPromise._reject);
                         }
                    }catch(error){
                        this.thenPromise.status='reject';
                        this.thenPromise.value=error;
                    }
                }
            }else{
                this.thenPromise.value=returnVal;
                this.thenPromise.status='resolve';
            }
                        
        }
    }else{
        
    }
}
pro.prototype._reject = function(resolveData) {

}
//测试0
var P=new pro((re,rj)=>{
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