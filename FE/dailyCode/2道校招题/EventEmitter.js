function EventEmitter() {
    this.handlers={};
}
EventEmitter.prototype = {
    on: function (eventName,handle) {
        if(this.handlers[eventName]){
            this.handlers[eventName].push(handle)
        }else{
            this.handlers[eventName]=[handle];
        }
    },
    once: function (eventName,handle) {
        !this.handlers[eventName]&&(this.handlers[eventName]=[]);
        this.handlers[eventName].push((function(){
            var isdone=false,
                context=this,
                args=arguments;
            return function(){
                if(isdone){
                    return;
                }else{
                    isdone=true;
                    handle.apply(context,args);
                }
            }
        })())
    },
    fire: function (eventName) {
        if(!this.handlers[eventName])return;
        this.handlers[eventName].forEach(function(handle) {
            handle();
        }, this);
    },
    off: function (eventName,handle) {
         if(eventName){
             if(handle){
                 this.handlers[eventName].splice(this.handlers[eventName].indexOf(handle),1);
             }else{
                 delete this.handlers[eventName];
             }
         }else{
             this.handlers={};
         }
    }
}

var event=new EventEmitter();

event.on("sleep",function(){
    console.log('sleep');
});

event.once("sleep",function(){
    console.log('sleep again');
});

event.fire("sleep");
event.fire("sleep");

event.off('sleep');
event.fire("sleep");