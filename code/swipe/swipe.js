(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Swipe = factory());
}(this, function() {
    var Swipe = function(config) {
        this.container = config.container;
        this.child = config.child;
        this.intervaltime = config.intervaltime||1000;
        var con=this.container;
        var status={
            sX:0,
            mX:0,
            eX:0,
            animating:false
        }
        var self=this;

        function touchStart(e){
            if(status.animating){
                self.stopAnimate();
            }
            self.stopTransition();
            status.sX=e.changedtouches[0].pageX;
        }    

        function touchMove(){
           status.mX 

        }       

        function touchEnd(){

        }

        function initEvent(){
            addEvent(con,'touchstart',touchStart);
            addEvent(con,'touchmove',touchMove);
            addEvent(con,'touchend',touchEnd);
        }
        initEvent();
    
    }
    Swipe.prototype={
        addEvent:function(el,type,handle,iscapture){
            el.addEventListener(type, handle, iscapture||false);
        },
        issupportCss3:function(){
            return  true;
        },
        stopTransition:function(){
            con.style.transitionDuration = 0;
        },
        setTransition:function(){
            con.style.transitionDuration = 0;
        }

    }
    return Swipe;
}));

