function isFunction(val){
    return typeof val=='function';
}
function isObject(val){
    return typeof val=='object';
}

function pro(fn) {
     this.state='pending';
     this.value;
     this.tasklist=[];
     var re=function(resolveData){this.resolve(resolveData)}.bind(this),
         rj=function(resolveData){this.reject(resolveData)}.bind(this);
         if(isFunction(fn)){
             fn(re,rj) 
         }
     
}
pro.prototype.then = function(refn,rjfn) {
    var returnValue;
    if(this.status=='resolve'){
        if(isFunction(refn)){
           returnValue=setTimeout(refn(this.value));
        }
    }
    if(!isObject(returnValue)){
        var p=new pro();
        p.resolve(returnValue);
        return p;
    }
}
pro.prototype.resolve = function(resolveData) {
    if(this.status!="resolve"&&this.status!="reject"){
        this.status="resolve";
        this.value=resolveData;
    }else{
        
    }
}
pro.prototype.reject = function(resolveData) {

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