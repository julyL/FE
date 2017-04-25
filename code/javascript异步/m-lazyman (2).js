_LazyMan=function(name){
   this.name=name;
   this.queue=[];
   this.timer=null;
}
var LazyMan=function(name){
   var man=new _LazyMan(name);
   man.queue.push({
       name:"init name",
       param:name
   });
   man.lazyrun(man.queue);
   return man;
}
_LazyMan.prototype.lazyrun=function(){
    if(this.timer){
        clearTimeout(this.timer);
    }
    this.timer=setTimeout(()=>{
       run(this.queue);      
   },0);
}
function run(queue){
    if(!queue){
        return;
    }
    var sleepFirstfIndex;
    queue.forEach((val,index)=>{
        if(val.name=='sleepFirst'){
            !sleepFirstfIndex&&(sleepFirstfIndex=index);
        }
    })
    if(sleepFirstfIndex){
        var sf=queue.splice(sleepFirstfIndex,1);
        setTimeout(function(){
            console.log("sleepFirst Wake up after "+sf[0].param,(+new Date()-date)/1000);
             run(queue);
        },sf[0].param*1000)      
        return;   
    }
    
    for(var i=0;i<queue.length;i++){
        var q=queue[i];
       if(q.name=='init name'){
           console.log("Hi This is"+q.param);
       }else if(q.name=="eat"){
           console.log("Eat "+q.param);
       }else if(q.name=="sleep"){
         setTimeout(function(){
            console.log("sleep Wake up after "+q.param,(+new Date()-date)/1000);
             run(queue.slice(i+1));
         },q.param*1000) 
           break;
       }   
    }
}   
_LazyMan.prototype.eat=function(food){
    this.queue.push({
       name:"eat",
       param:food
    }); 
    this.lazyrun(this.queue);
    return this;
}
_LazyMan.prototype.sleep=function(time){
    this.queue.push({
       name:"sleep",
       param:time
    }); 
    this.lazyrun(this.queue);
    return this;
}
_LazyMan.prototype.sleepFirst=function(time){
    this.queue.push({
       name:"sleepFirst",
       param:time
    }); 
    this.lazyrun(this.queue);
    return this;
}
var date=+new Date();
LazyMan("Hank").sleep(2).eat("supper").sleep(1).eat("dinner").sleepFirst(4);


