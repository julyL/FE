(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Swipe = factory());
}(this, function() {
    var Swipe = function(config) {
        this.container = config.container;
        this.child = config.child;
        this.intervaltime = config.intervaltime || 1000;
        var con = this.container;
        var clientW = con.clientWidth,
            activeIndex = 0,
            len = this.child.length,
            limitWidth = 40;
        this.child[activeIndex].style.display="block";
        this.child[activeIndex].style.transform="translate3d(0px, 0px, 0px)";
        var status = {
            X: 0,
            sX: 0,
            mX: 0,
            eX: 0,
            animating: false,
            prevElement: this.child[len - 1],
            nextElement: this.child[1],
            activeElement:this.child[0],
            moveDirection:"0",   //   -1:左  1:右 
        }
        this.status = status;
        var self = this;

        function touchStart(e) {
            if (status.animating) {
                self.stopAnimate();
            }
            status.X = self.getX(status.activeElement);
            self.stopTransition();
            status.sX = e.changedTouches[0].pageX;
            console.log(1, status);
        }

        function setLocation(el, x) {
            el.style.transform = "translate3d(" + (x) + "px, 0px, 0px)";
        }

        function touchMove(e) {
            self.stopTransition();
            console.log(2, status);
            status.mX = e.changedTouches[0].pageX;
            var changeX = status.X + status.mX - status.sX;
            if (status.mX > status.sX) {   // moveDirection=1  右边
                if(status.moveDirection==-1){   //  先左滑动 再右滑动 (当前activeIndex右边的位置可能出现错位，进行手动定位修复)
                    self.fixLocation(activeIndex==len-1?0:activeIndex+1)
                }
                status.moveDirection=1;
                console.log(activeIndex,"->")
                status.prevElement = self.child[activeIndex == 0 ? len - 1 : activeIndex - 1];
                status.nextElement=
                status.prevElement.style.display = "block";
                if (!status.animating) {   // 不是在切换动画过程中，则设置初始位置
                    setLocation(status.prevElement,-clientW);
                }
                setLocation(status.prevElement,changeX - clientW);
            } else {    // moveDirection=-1  左边
                if(status.moveDirection==1){  
                    self.fixLocation(activeIndex==0?len-1:activeIndex-1)
                }
                status.moveDirection=-1;
                console.log(activeIndex,"<-")
                status.nextElement = self.child[activeIndex == len - 1 ? 0 : activeIndex + 1];
                status.nextElement.style.display = "block";
                if (!status.animating) {
                    setLocation(status.nextElement,clientW);
                }
                setLocation(status.nextElement,changeX + clientW);
            }
            status.activeElement=self.child[activeIndex];
            setLocation(status.activeElement,changeX );
        }

        function touchEnd(e) {
            status.moveDirection=0;
            self.setTransition();
            status.eX = e.changedTouches[0].pageX;
            var diff = status.eX - status.sX;
            if (diff > 0) { // 右滑动
                if (diff > limitWidth) {
                    setLocation(status.prevElement, 0);
                    setLocation(status.activeElement, clientW);
                    activeIndex = activeIndex == 0 ? len - 1 : activeIndex - 1;
                } else {
                    setLocation(status.prevElement, -clientW);
                    setLocation(status.activeElement, 0);
                }
            } else if (diff < 0) { //左滑动
                if (-diff > limitWidth) {
                    setLocation(status.nextElement, 0);
                    setLocation(status.activeElement, -clientW);
                    activeIndex = activeIndex == len - 1 ? 0 : activeIndex + 1;
                } else {
                    setLocation(status.nextElement, clientW);
                    setLocation(status.activeElement, 0);
                }
            }
        }

        function initEvent() {
            self.addEvent(con, 'touchstart', touchStart);
            self.addEvent(con, 'touchmove', touchMove);
            self.addEvent(con, 'touchend', touchEnd);
        }
        initEvent();

    }
    Swipe.prototype = {
        addEvent: function(el, type, handle, iscapture) {
            el.addEventListener(type, handle, iscapture || false);
        },
        issupportCss3: function() {
            return true;
        },
        stopTransition: function() {
            this.child.forEach(function(el) {
                el.style.transitionDuration = '0s';
            })
        },
        setTransition: function() {
            this.child.forEach(function(el) {
                el.style.transitionDuration = '.4s';
            })
        },
        getX: function(el) {
            var t = el.style.tranform;
            return /translate3d\((.*?),.*/g.exec(t) && /translate3d\((.*?),.*/g.exec(t)[0].slice(0, -2);
        },
        fixLocation:function(index){
            var el=this.child[index];
            el.style.display="none";
            el.style.transform="none";
        }

    }
    return Swipe;
}));
