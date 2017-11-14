/*
    https://github.com/ElemeFE/vue-infinite-scroll
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.infiniteScroll = factory());
}(this, (function() {
    'use strict';

    var ctx = '@@InfiniteScroll';

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

    var getScrollTop = function getScrollTop(element) {
        if (element === window) { // window.scrollTop 为undefiend 需要特殊处理
            return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
        }

        return element.scrollTop;
    };

    var getComputedStyle = document.defaultView.getComputedStyle;


    // 从element开始往父级查找最近的设置过滚动的元素
    var getScrollEventTarget = function getScrollEventTarget(element) {
        var currentNode = element;
        // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
        while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
            var overflowY = getComputedStyle(currentNode).overflowY;
            if (overflowY === 'scroll' || overflowY === 'auto') {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return window;
    };


    var getVisibleHeight = function getVisibleHeight(element) {
        if (element === window) { // window.clientHeight === undefined   别搞混了  window.innerHeight(返回窗口的文档显示区的高度) 
            return document.documentElement.clientHeight;
        }
        return element.clientHeight;
    };

    // 获得element距离视口顶部的距离
    var getElementTop = function getElementTop(element) {
        if (element === window) {
            return getScrollTop(window);
        }
        return element.getBoundingClientRect().top + getScrollTop(window);
    };

    // 是否已经在html文档中
    var isAttached = function isAttached(element) {
        var currentNode = element.parentNode;
        while (currentNode) {
            if (currentNode.tagName === 'HTML') {
                return true;
            }
            if (currentNode.nodeType === 11) { //  Document Fragment
                return false;
            }
            currentNode = currentNode.parentNode;
        }
        return false;
    };

    var doBind = function doBind() {
        if (this.binded) return; //  只执行一次
        this.binded = true;

        var directive = this;
        var element = directive.el;

        // 获取滚动元素, 绑定scroll事件
        directive.scrollEventTarget = getScrollEventTarget(element);
        directive.scrollListener = throttle(doCheck.bind(directive), 200);
        directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);

        this.vm.$on('hook:beforeDestroy', function() {
            directive.scrollEventTarget.removeEventListener('scroll', directive.scrollListener);
        });

        var disabledExpr = element.getAttribute('infinite-scroll-disabled');
        var disabled = false;
        if (disabledExpr) { // 处理: 需要添加watch根据infinite-scroll-immediate-check检测是否需要执行doCheck
            this.vm.$watch(disabledExpr, function(value) {
                directive.disabled = value;
                if (!value && directive.immediateCheck) {    //处理需要自动撑开容器的情况,每次infinite-scroll-disabled变化都执行doCheck
                    // infinite-scroll-disabled == false && infinite-scroll-immediate-check == true
                    doCheck.call(directive);
                }
            });
            disabled = Boolean(directive.vm[disabledExpr]);
        }
        directive.disabled = disabled;

        // 加载事件触发阈值的 容错性处理
        var distanceExpr = element.getAttribute('infinite-scroll-distance');
        var distance = 0;
        if (distanceExpr) {
            distance = Number(directive.vm[distanceExpr] || distanceExpr);
            if (isNaN(distance)) {
                distance = 0;
            }
        }
        directive.distance = distance;


        // 检测是否设置了容器自动撑开
        var immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check');
        var immediateCheck = true;
        if (immediateCheckExpr) {
            immediateCheck = Boolean(directive.vm[immediateCheckExpr]);
        }
        directive.immediateCheck = immediateCheck;
        if (immediateCheck) {
            doCheck.call(directive);
        }


        var eventName = element.getAttribute('infinite-scroll-listen-for-event');
        if (eventName) {
            directive.vm.$on(eventName, function() {
                doCheck.call(directive);
            });
        }
    };

    //  滚动时执行的函数
    var doCheck = function doCheck(force) {
        var scrollEventTarget = this.scrollEventTarget;
        var element = this.el;
        var distance = this.distance;

        if (force !== true && this.disabled) return;    
        var viewportScrollTop = getScrollTop(scrollEventTarget);
        var viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);

        var shouldTrigger = false;

        if (scrollEventTarget === element) {
            shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;    // 自身距离底部的距离 <= distance
        } else {
            var elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop;

            shouldTrigger = viewportBottom + distance >= elementBottom;
            //  getVisibleHeight(scrollEventTarget) + distance >= getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight 
        }

        if (shouldTrigger && this.expression) {
            this.expression();
        }
    };

    var InfiniteScroll$1 = {
        bind: function bind(el, binding, vnode) {
            el[ctx] = {
                el: el,
                vm: vnode.context,
                expression: binding.value
            };
            var args = arguments;
            el[ctx].vm.$on('hook:mounted', function() {
                el[ctx].vm.$nextTick(function() {
                    if (isAttached(el)) {
                        doBind.call(el[ctx], args);
                    }

                    el[ctx].bindTryCount = 0;

                    var tryBind = function tryBind() {
                        if (el[ctx].bindTryCount > 10) return; // 处理el可能还没有插入到html文档中的情况: 设置定时器执行tryBind,如果超过11次还没有执行doBind就直接return。
                        el[ctx].bindTryCount++;
                        if (isAttached(el)) {
                            doBind.call(el[ctx], args);
                        } else {
                            setTimeout(tryBind, 50);
                        }
                    };

                    tryBind();
                });
            });
        },
        unbind: function unbind(el) {
            if (el && el[ctx] && el[ctx].scrollEventTarget) el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener);
        }
    };

    var install = function install(Vue) {
        Vue.directive('InfiniteScroll', InfiniteScroll$1);
    };

    if (window.Vue) {
        window.infiniteScroll = InfiniteScroll$1;
        Vue.use(install); // eslint-disable-line
    }

    InfiniteScroll$1.install = install;

    return InfiniteScroll$1;

})));