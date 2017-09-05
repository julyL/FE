(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.InfiniteScroll = factory());
}(this, (function() {

        var throttle = function throttle(fn, delay) { // 节流
            var now, lastExec, timer, context, args;
            var execute = function execute() {
                fn.apply(context, args);
                lastExec = now;
            };
            return function() {
                context = this;
                args = arguments;
                now = Date.now();
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (lastExec) {
                    var diff = delay - (now - lastExec);
                    if (diff < 0) { // now-lastExec > delay   距离上次的执行的时间间隔 > delay 则立刻执行
                        execute();
                    } else {
                        timer = setTimeout(function() { // 根据剩余时间,重新设置定时器
                            execute();
                        }, diff);
                    }
                } else {
                    execute();
                }
            };
        };

    function InfiniteScroll(config) {
        this.el = config.el || document.documentElement;
        this.fn = config.fn;
        this.distance = config.distance || 0;
        this.lock = false;
        this.scrollHandle = function() {
            if (this._canload() && !this.lock) {
                this.fn();
            }
        }

        this._canload = function() {
            var el = this.el;
            if (el.scrollTop + el.clientHeight + this.distance >= el.scrollHeight) {
                return true;
            } else {
                return false;
            }
        }
    }
    InfiniteScroll.prototype = {
        constructor: InfiniteScroll,
        bindScroll: function() {
            this.el.addEventListener('scroll', throttle(this.scrollHandle.bind(this),200), false);
        },
        unbindScroll: function() {
            this.el.removeEventListener('scroll', throttle(this.scrollHandle.bind(this),200), false);
        },
        init: function() {
            this.bindScroll();
        }
    }
    return InfiniteScroll;
})));