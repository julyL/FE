/*
    实现功能罗列：
    可以在指定container中实现 图片懒加载
    实现可选的显示动画

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

    function isInview(img) { // 判断图片是在可视区域
        var imgPosition = offset(img);
        if (imgPosition.top < window.innerHeight) {
            return true;
        }
        return false;
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

    var requestAnimationFrame = window.requestAnimationFrame1 || function(fn) {
        var context = this,
            args = arguments;
        return setTimeout(function() {
            fn.call(context, args);
        }, 16)
    }

    var cancelAnimationFrame = window.cancelAnimationFrame1 || function(timer) {
        clearTimeout(timer);
    }

    function isSupportCss3() {
        return document.body.style.transition != undefined || document.body.style.WebkitTransition != undefined;
    }

    function animation(dom, startCss, endCss, time) {
        if (isSupportCss3()) {
            Object.keys(startCss).forEach(function(val, index) {
                dom.style.transition = 'none';
                dom.style[val] = startCss[val];
            });
            Object.keys(startCss).forEach(function(val, index) {
                dom.style.transition = "all " + time / 1000 + "s";
                // setTimeout(function() {
                    // dom.style[val] = endCss[val];
                // }, 1000);
            });
            return;
        }
        Object.keys(startCss).forEach(function(val, index) {
            dom.style[val] = startCss[val];
            var timer = requestAnimationFrame((function() {
                // debugger;
                var add = (endCss[val] - startCss[val]) / (time / 16);
                if (parseFloat(dom.style[val]) + add < endCss[val]) {
                    dom.style[val] = parseFloat(dom.style[val]) + add;
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


            i;
        config = config || {};
        this.container = config.container || querySe("body");
        this.imgAttribute = config.imgAttribute || "data-original";
        this.distance = config.distance || 0;
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

        var self = this;
        handler = throttle(function() {
            foreachImg(function(img, index) {
                if (isInview(img)) {
                    var image = new Image(),
                        originUrl = img.getAttribute(self.imgAttribute);
                    if ((img.src == originUrl || img.src == self.errorImg) && originUrl != self.errorImg) { //为true时说明图片已经加载过,并且排除 placeholderImg和errorImg设置成一样的问题
                        return;
                    }
                    image.onload = function() {
                        img.src = originUrl;
                        img.removeAttribute(self.imgAttribute);
                        img.setAttribute("data-imglazy", "lazyed");
                        if (self.showAnimation == 'fade') {
                            img.style.opacity = .3;
                            animation(img, {
                                opacity: .3
                            }, {
                                opacity: 1
                            }, 5000);
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
            img.setAttribute("data-imglazy", "lazying");
        })
        handler();

        var scrolldom = container;
        while (scrolldom.nodeName.toLocaleLowerCase() != "html") { // 只要是 container或者container的父级  发生滚动时就应该判断是否加载图片
            if (window.getComputedStyle(scrolldom, null).overflow != 'hidden') {
                scrolldom.addEventListener("scroll", handler, false);
            }
            scrolldom = scrolldom.parentElement;
        }
    }


    window.imgLazyload = imgLazyload;
})();
