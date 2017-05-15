(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Swipe = factory());
}(this, function() {
    var Swipe = function(config) {
        this.container = config.container;
        this.child = config.child;
        this.intervalTime = config.intervalTime || 5000; //不可设置为 0
        this.showIndicators = config.showIndicators === false ? false : true;
        this.speed = config.speed || 500;
        this.triggerDistance = config.triggerDistance || 40;
        var con = this.container,
            clientW = con.clientWidth,
            len = this.child.length,
            self = this,
            indicators,
            indicator = [],
            activeIndicator;
        if (len == 1) {
            return;
        }
        var status = {
            X: 0,
            sX: 0,
            mX: 0,
            eX: 0,
            activeIndex: 0,
            prevElement: this.child[len - 1],
            nextElement: this.child[1],
            activeElement: this.child[0],    
            moveDirection: 0, //   -1:左  1:右 
            timer: null,
        }
        this.status = status;
        self.container.classList.add("swipe-container");
        this.child.forEach(function(el) {
            el.classList.add("swipe-item");
        })
        this.child[status.activeIndex].style.display = "block";
        this.child[status.activeIndex].style.transform = "translate3d(0px, 0px, 0px)";
        if (this.showIndicators) { //显示计时器
            indicators = document.createElement("div");
            indicators.classList.add("swipe-indicators");
            for (var i = 0; i < len; i++) {
                indicator[i] = document.createElement("div");
                indicator[i].classList.add("swipe-indicator");
                if (i == status.activeIndex) {
                    indicator[i].classList.add("is-active");
                    activeIndicator = indicator[i];
                }
                indicators.appendChild(indicator[i]);
            }
            this.container.appendChild(indicators);
        }

        function touchStart(e) {
            stopAnimate();
            stopTransition();
            status.X = getX(status.activeElement);
            status.sX = e.changedTouches[0].pageX;
        }

        function touchMove(e) {
            stopTransition();
            status.mX = e.changedTouches[0].pageX;
            var changeX = status.X + status.mX - status.sX;
            if (status.mX > status.sX) { // moveDirection=1  右边
                if (status.moveDirection == -1) { //  先左滑动,接着右滑动 (当前status.activeIndex右边的dom定位可能出错,进行手动定位修复)
                    fixLocation(getNextIndex())
                }
                status.moveDirection = 1;
                status.prevElement = self.child[getPrevIndex()];
                status.prevElement.style.display = "block";
                setLocation(status.prevElement, changeX - clientW);
            } else { // moveDirection=-1  左边
                if (status.moveDirection == 1) {
                    fixLocation(getPrevIndex())
                }
                status.moveDirection = -1;
                status.nextElement = self.child[getNextIndex()];
                status.nextElement.style.display = "block";
                setLocation(status.nextElement, changeX + clientW);
            }
            status.activeElement = self.child[status.activeIndex];
            setLocation(status.activeElement, changeX);
        }

        function touchEnd(e) {
            setTransition();
            status.moveDirection = 0;
            status.eX = e.changedTouches[0].pageX;
            var diff = status.eX - status.sX;
            if (diff > 0) { // 右滑动
                if (diff >= self.triggerDistance) {
                    setLocation(status.prevElement, 0);
                    setLocation(status.activeElement, clientW);
                    status.activeIndex = getPrevIndex();
                } else {
                    setLocation(status.prevElement, -clientW);
                    setLocation(status.activeElement, 0);
                }
            } else if (diff < 0) { //左滑动
                if (-diff >= self.triggerDistance) {
                    setLocation(status.nextElement, 0);
                    setLocation(status.activeElement, -clientW);
                    status.activeIndex = getNextIndex();
                } else {
                    setLocation(status.nextElement, clientW);
                    setLocation(status.activeElement, 0);
                }
            }
            status.activeElement = self.child[status.activeIndex];
        }

        function getPrevIndex() {
            return status.activeIndex == 0 ? len - 1 : status.activeIndex - 1;
        }

        function getNextIndex() {
            return status.activeIndex == len - 1 ? 0 : status.activeIndex + 1;
        }

        function addEvent(el, type, handle, iscapture) {
            el.addEventListener(type, handle, iscapture || false);
        }

        function issupportCss3() {
            var div = document.createElement("div");
            return div.style.transform === undefined ? false : true;
        }

        function stopTransition() {
            self.child.forEach(function(el) {
                el.style.transitionDuration = '0s';
            })
        }

        function setTransition() {
            var speed = (self.speed / 1000) + "s";
            self.child.forEach(function(el) {
                el.style.transitionDuration = speed;
            })
        }

        function getX(el) {
            var t = el.style.tranform;
            return /translate3d\((.*?),.*/g.exec(t) && /translate3d\((.*?),.*/g.exec(t)[0].slice(0, -2);
        }

        function fixLocation(index) {
            var el = self.child[index];
            el.style.display = "none";
            el.style.transform = "none";
        }

        function setLocation(el, x) {
            el.style.transform = "translate3d(" + (x) + "px, 0px, 0px)";
        }

        function stopAnimate() {
            clearTimeout(status.timer);
            status.timer=null;
        }

        function startAnimate() {
            status.timer = setTimeout(function() {
                slide();
            }, self.intervalTime)
        }

        function slide() {
            stopTransition();
            status.nextElement = self.child[getNextIndex()];
            setLocation(status.nextElement, clientW);
            status.nextElement.style.display = 'block';
            //由于需要设置nextElement的起始位置和最终位置，必须添加setTimeout否则没有动画效果
            setTimeout(function() {
                setTransition();
                setLocation(status.activeElement, -clientW);
                setLocation(status.nextElement, 0);
                status.activeIndex = (status.activeIndex + 1) % len;
                status.activeElement = self.child[status.activeIndex];
            }, 20)
        }
        
        function initEvent() {
            addEvent(con, 'touchstart', touchStart);
            addEvent(con, 'touchmove', touchMove);
            addEvent(con, 'touchend', touchEnd);
            self.child.forEach(function(el, number) {
                addEvent(el, "transitionend", function() {
                    if (el != status.activeElement) {
                        el.style.display = "none";
                    }else{
                        startAnimate();     
                    }
                    if (self.showIndicators) {
                        activeIndicator.classList.remove("is-active");
                        activeIndicator = indicator[status.activeIndex];
                        activeIndicator.classList.add("is-active");
                    }
                })
            })
        }
        initEvent();
        startAnimate();
    }
    Swipe.prototype = {
        getIndex: function() {
            return this.status.activeIndex;
        }
    }
    return Swipe;
}));
