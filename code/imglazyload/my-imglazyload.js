/*
    var img=document.querySelector("img");
    img.style.transition = 'none';
    img.style.opacity=0;
    console.log(img.style.transition);   // none

    img.style.transition="all 3s";       
    // img的opacity会渐变到0, 尽管设置opacity之前已经,设置transition为none  
    // (推测: 当前执行队列中同时更改了设置了style对象时,浏览器会直接采用最终的值,并且所有的样式是同时应用的，opacity:0;和transition:all .3s;同时设置在img对象上)

    setTimeout(function(){
        img.style.transition="all 3s";      //与上面不同,img不会存在渐变动画  通过setTimeout创建了一个新的执行队列，这时会先这时 opacity:0;  再设置transition
    },0)

 */
(function() {
    var querySe = function() {
            return document.querySelector.call(document, arguments[0])
        },
        queryAll = function() {
            return document.querySelectorAll.call(document, arguments[0])
        };

    function throttle(fn, time) {
        var timer;
        return function() {
            var context = this,
                args = arguments;
            if (timer) {
                return;
            }
            timer = setTimeout(function() {
                fn.call(context, args);
                timer = null;
            }, time);
        }
    }

    function offset(el) { // 获取图片距离window视口的位置信息
        var obj = el.getBoundingClientRect();
        return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: obj.width,
            height: obj.height
        };
    }

    var requestAnimationFrame = window.requestAnimationFrame || function(fn) {
        var context = this,
            args = arguments;
        return setTimeout(function() {
            fn.call(context, args);
        }, 16)
    }

    var cancelAnimationFrame = window.cancelAnimationFrame || function(timer) {
        clearTimeout(timer);
    }

    function isSupportCss3() {
        return document.body.style.transition != undefined || document.body.style.WebkitTransition != undefined;
    }

    function animation(dom, startCss, endCss, time, animationFn) {
        animationFn = animationFn || function(start, end, time) { // 增量变化函数
            return (end - start) / (time / 16);
        }
        if (isSupportCss3()) {
            Object.keys(startCss).forEach(function(val, index) {
                dom.style.transition = 'none';
                dom.style[val] = startCss[val];
            });
            // 改进代码
            setTimeout(function() {
                dom.style.transition = "all " + time / 1000 + "s ease";
                Object.keys(startCss).forEach(function(val, index) {
                    dom.style[val] = endCss[val];
                });
            }, 30); // 这里设置的时间过小时(例如10),当time设置一个较大的值(例如5000)  会出现部分img的渐入效果失效 why??
            return;
        }

        function getN(cssStyle) { //获取css属性中的数值 (不支持background,translate3d等)
            return parseFloat(String(cssStyle).match(/\d*.?\d*/)[0]);
        }
        Object.keys(startCss).forEach(function(val, index) {
            dom.style[val] = startCss[val];
            var timer = requestAnimationFrame((function() {
                var add = animationFn(getN(startCss[val]), getN(endCss[val]), time);
                if (getN(dom.style[val]) + add < getN(endCss[val])) {
                    dom.style[val] = getN(dom.style[val]) + add;
                    requestAnimationFrame(arguments.callee);
                } else {
                    dom.style[val] = endCss[val];
                    cancelAnimationFrame(timer);
                }
            }))
        });
    }

    var imgLazyload = function(config) {
        var container, // 容器
            containerPosition, // 容器的位置信息
            handler, //  绑定的滚动事件
            loadimgs, // 需要处理的图片dom集合
            loadimgsArr, // 将loadimgs转换为数组
            self = this,
            i;
        config = config || {};
        this.container = config.container || querySe("body");
        this.imgAttribute = config.imgAttribute || "data-original";
        this.distance = config.distance || 0;
        this.ordinal = config.ordinal || false; //图片加载时是否按顺序
        this.placeholderImg = config.placeholderImg || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; //占位图片
        this.errorImg = config.errorImg || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"; //加载失败的图片
        this.loadingAction = config.loadingAction || "default"; // 默认是图片距离视图distance时就加载图片  
        this.showAnimation = config.showAnimation == "none" ? "none" : "fade";

        container = this.container;
        containerPosition = offset(container);

        function foreachImg(fn) { // 循环操作图片
            var context = this;
            loadimgs = this.container.querySelectorAll("img[" + this.imgAttribute + "]");
            loadimgsArr = [].slice.call(loadimgs);

            loadimgsArr.forEach(function(img, index) {
                fn.call(context, img, index);
            });
        }

        function isInview(img) { // 判断图片是在可视区域
            var imgPosition = offset(img);
            if (imgPosition.top -self.distance < window.innerHeight) {
                return true;
            }
            return false;
        }
        handler = throttle(function() {
            foreachImg(function(img, index) {
                if (isInview(img)) {
                    var image = new Image(),
                        originUrl = img.getAttribute(self.imgAttribute);
                    if ((img.src == originUrl || img.src == self.errorImg) && originUrl != self.errorImg) {
                        //为true时说明图片已经加载过(onload和error中的事件已经执行过了),并且排除placeholderImg和errorImg设置成一样的问题
                        return;
                    }
                    image.onload = function() {
                        if (!img.getAttribute(self.imgAttribute)) { //防止onload事件多次执行
                            return;
                        }
                        img.src = originUrl;
                        img.removeAttribute(self.imgAttribute);
                        img.setAttribute("data-imglazy", "lazyed");
                        if (self.showAnimation == 'fade') { //默认动画fade
                            animation(img, {
                                opacity: 0
                            }, {
                                opacity: 1
                            }, 1000);
                        }
                    };
                    image.error = function() {
                        img.src = self.errorImg;
                        img.removeAttribute(self.imgAttribute);
                        img.setAttribute("data-imglazy", "lazyed");
                    }
                    image.src = originUrl;
                }
            });
        }, 100);

        // 初始化的一些设置
        foreachImg(function(img) {
            img.src = this.placeholderImg;
            img.style.transformStyle = "preserve-3d";
            img.style.backfaceVisibility = "hidden";
            img.setAttribute("data-imglazy", "lazying");
        })
        handler();

        var scrolldom;
        if (loadimgs.length == 0) {
            return;
        }
        scrolldom = loadimgs[0].parentElement;
        while (scrolldom.nodeName.toLocaleLowerCase() != "html") { //  需要判断所有需要懒加载的图片的父级,如果父级可滚动，并且发生滚动时就应该判断是否应该加载图片
            if (window.getComputedStyle(scrolldom, null).overflow != 'hidden') {
                scrolldom.addEventListener("scroll", handler, false);
            }
            scrolldom = scrolldom.parentElement;
        }
    }
    window.imgLazyload = imgLazyload;
})();
