(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Swipe = factory());
}(this, function() {
    var Swipe = function(config) {
        this.container = config.container;
        this.scrollpart = config.scrollpart;
        this.time = config.time||1000;
        this.isloop=config.isloop||true;

        var con = this.container,
            number=this.scrollpart.length,
            scrollWidth=con.clientWidth,
            triggerW=20,
            startX,
            endX,
            moveendX,
            stop=false,
            wrap,
            self=this;

        wrap=document.createElement('div');
        for(var i=0;i<number+1;i++){
            var node=i==number?this.scrollpart[0].cloneNode(true):this.scrollpart[i];
            wrap.appendChild(node);
            node.className=node.className+" swipe-item";
            node.style.width = (100/(number+1))+"%";  
        }
        wrap.className="swipe-wrap";
        wrap.style.width=(number+1)*100+"%";

        this.container.appendChild(wrap);

        var obj={},
            index;
        Object.defineProperty(obj, 'index', {
            set:function(val){
                index=val;
                wrap.style.transform = 'translate3d(' + -(val * scrollWidth) + 'px,0,0)';
            },
            get:function(val){
                return index;
            }
        });
        obj.index=0;

        wrap.addEventListener('touchstart', function(e) {
            stop=true;
            e.preventDefault();
            startX = e.touches[0].clientX;
        }, false);

        wrap.addEventListener('touchmove', function(e) {
             moveendX = e.changedTouches[0].pageX;
            if (moveendX > startX) {
                wrap.style.transform = 'translate3d(' + (-obj.index*scrollWidth+moveendX-startX) + 'px,0,0)';
            } else if (moveendX < startX) {
                wrap.style.transform = 'translate3d(' + (-obj.index*scrollWidth+moveendX-startX) + 'px,0,0)';
            }
        }, false);

        wrap.addEventListener('touchend', function(e) {
             endX = e.changedTouches[0].pageX;
            if (endX + triggerW < startX) {
                if (obj.index >= number - 1) {   //向左滑动
                    obj.index=obj.index;
                } else {
                    obj.index++;   
                }
            } else if (endX - triggerW > startX) {
                if (obj.index <= 0) {
                    obj.index=0;
                } else {
                    obj.index--;
                }
            } else {
                obj.index=obj.index;
            }
            stop=false;
            setTimeout(function(){
            self.start();

            },this.time)
        }, false);  
        this.start=function(){
            this.setloop();
        }
        this.setloop=function(){
            var self=this;
            if(stop){
                return;
            }
            setTimeout(function(){
                if(self.isloop){
                    obj.index++;
                    if(obj.index==number){
                        setTimeout(function(){
                            wrap.style.transition="none";
                            obj.index=0;
                            setTimeout(function(){
                                wrap.style.transition="all .5s";
                            },100)
                            // obj.index=1;                         
                        },300)
                    }
                    self.setloop();
                }      
            },this.time);
        }
        this.start();
    }
    return Swipe;
}));

