(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Swipe = factory());
}(this, function() {
    var Swipe = function(config) {
        this.container = config.container;
        this.child = config.child;
        this.intervaltime = config.intervaltime || 5000;
        this.timer = null;
        this.showIndicators = config.showIndicators === false ? false : true;
        var con = this.container,
            clientW = con.clientWidth,
            len = this.child.length,
            self = this,
            limitWidth = 40,
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
            animating: false,
            prevElement: this.child[len - 1],
            nextElement: this.child[1],
            activeElement: this.child[0],
            moveDirection: "0", //   -1:左  1:右 
        }
        this.status=status;
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
            status.X = self.getX(status.activeElement);
            self.stopTransition();
            status.sX = e.changedTouches[0].pageX;
        }

        function setLocation(el, x) {
            el.style.transform = "translate3d(" + (x) + "px, 0px, 0px)";
        }

        function touchMove(e) {
            self.stopTransition();
            status.mX = e.changedTouches[0].pageX;
            var changeX = status.X + status.mX - status.sX;
            if (status.mX > status.sX) { // moveDirection=1  右边
                if (status.moveDirection == -1) { //  先左滑动 再右滑动 (当前status.activeIndex右边的位置可能出现错位，进行手动定位修复)
                    self.fixLocation(status.activeIndex == len - 1 ? 0 : status.activeIndex + 1)
                }
                status.moveDirection = 1;
                // console.log(status.activeIndex, "->")
                status.prevElement = self.child[status.activeIndex == 0 ? len - 1 : status.activeIndex - 1];
                status.prevElement.style.display = "block";
                if (!status.animating) { // 不是在切换动画过程中，则设置初始位置
                    setLocation(status.prevElement, -clientW);
                }
                setLocation(status.prevElement, changeX - clientW);
            } else { // moveDirection=-1  左边
                if (status.moveDirection == 1) {
                    self.fixLocation(status.activeIndex == 0 ? len - 1 : status.activeIndex - 1)
                }
                status.moveDirection = -1;
                // console.log(status.activeIndex, "<-")
                status.nextElement = self.child[status.activeIndex == len - 1 ? 0 : status.activeIndex + 1];
                status.nextElement.style.display = "block";
                if (!status.animating) {
                    setLocation(status.nextElement, clientW);
                }
                setLocation(status.nextElement, changeX + clientW);
            }
            status.activeElement = self.child[status.activeIndex];
            setLocation(status.activeElement, changeX);
        }

        function touchEnd(e) {
            status.moveDirection = 0;
            self.setTransition();
            status.eX = e.changedTouches[0].pageX;
            var diff = status.eX - status.sX;
            if (diff > 0) { // 右滑动
                if (diff > limitWidth) {
                    setLocation(status.prevElement, 0);
                    setLocation(status.activeElement, clientW);
                    status.activeIndex = status.activeIndex == 0 ? len - 1 : status.activeIndex - 1;
                } else {
                    setLocation(status.prevElement, -clientW);
                    setLocation(status.activeElement, 0);
                }
            } else if (diff < 0) { //左滑动
                if (-diff > limitWidth) {
                    setLocation(status.nextElement, 0);
                    setLocation(status.activeElement, -clientW);
                    status.activeIndex = status.activeIndex == len - 1 ? 0 : status.activeIndex + 1;
                } else {
                    setLocation(status.nextElement, clientW);
                    setLocation(status.activeElement, 0);
                }
            }
            // debugger;
            status.activeElement = self.child[status.activeIndex];
            startAnimate();
        }

        function slide() {
            status.nextElement = self.child[status.activeIndex == len - 1 ? 0 : status.activeIndex + 1];
            self.stopTransition();
            status.nextElement.style.display = 'block';
            setLocation(status.nextElement, clientW);
            setTimeout(function() {
                self.setTransition();
                setLocation(status.activeElement, -clientW);
                setLocation(status.nextElement, 0);
                status.activeIndex = (status.activeIndex + 1) % len;
                status.activeElement = self.child[status.activeIndex];
            },10)
        }
        window.slide = slide;

        function stopAnimate() {
            status.animating = false;
            clearInterval(self.timer);
        }

        function startAnimate() {
            status.animating = true;
            self.timer = setInterval(function() {
                slide();
            }, self.intervaltime)
        }

        function initEvent() {
            self.addEvent(con, 'touchstart', touchStart);
            self.addEvent(con, 'touchmove', touchMove);
            self.addEvent(con, 'touchend', touchEnd);
            self.child.forEach(function(el, number) {
                self.addEvent(el, "transitionend", function() {
                    if (el != status.activeElement) {
                        el.style.display = "none";
                    }
                    if (self.showIndicators) {
                        activeIndicator.classList.remove("is-active");
                        activeIndicator = indicator[status.activeIndex];
                        activeIndicator.classList.add("is-active");
                    }
                })
            })
            startAnimate();
        }
        initEvent();
    }
    Swipe.prototype = {
        addEvent: function(el, type, handle, iscapture) {
            el.addEventListener(type, handle, iscapture || false);
        },
        issupportCss3: function() {
            var div = document.createElement("div");
            return div.style.transform === undefined ? false : true;
        },
        stopTransition: function() {
            this.child.forEach(function(el) {
                el.style.transitionDuration = '0s';
            })
        },
        setTransition: function() {
            this.child.forEach(function(el) {
                el.style.transitionDuration = '.5s';
            })
        },
        getX: function(el) {
            var t = el.style.tranform;
            return /translate3d\((.*?),.*/g.exec(t) && /translate3d\((.*?),.*/g.exec(t)[0].slice(0, -2);
        },
        fixLocation: function(index) {
            var el = this.child[index];
            el.style.display = "none";
            el.style.transform = "none";
        },
        getIndex:function(){
            return this.status.activeIndex;
        }
    }
    return Swipe;
}));
