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

    function animation(dom, startCss, endCss, time, animationFn) {   //简单的动画封装(比较简陋,待改善)
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
            }, 30); // 这里设置的时间过小(例如10),并且参数time设置一个较大的值(例如5000)  会出现部分img的渐入效果失效(直接显示了) why??
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

    function Queue() {
        this._queue = [];
        this.waitforExcuteNumber = 0;   
        // 每次scroll触发handle时，都会向队列中push相应的函数   waitforExcuteNumber表示上次handle中添加到队列中的函数还有多少没有执行
        this.lock=false;
    }

    Queue.prototype.push = function(fn) { //入栈
        this._queue.push(fn);
    }
    Queue.prototype.next = function() { // 执行
        if(this.lock){
            return;
        }
        var fn = this._queue.shift();
        if(fn){
            this.lock=true;
            fn();
        }
    }
    var imgLazyload = function(config) {
        var container, // 容器
            containerPosition, // 容器的位置信息
            handler, //  绑定的滚动事件
            loadimgs, // 需要处理的图片dom集合
            loadimgsArr, // 将loadimgs转换为数组
            self = this,
            queue = new Queue(); // 一个图片加载队列

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

        function _foreachImg(fn) { // 循环操作符图片(还没有执行onload和onerror的图片)
            var context = self;
            loadimgs = self.container.querySelectorAll("img[" + self.imgAttribute + "]");
            loadimgsArr = [].slice.call(loadimgs);
            loadimgsArr.forEach(function(img, index) {
                fn.call(context, img, index);
            });
        }

        function _isInview(img) { // 判断图片是在可视区域
            var imgPosition = offset(img);
            if (imgPosition.top - self.distance < window.innerHeight) {
                return true;
            }
            return false;
        }
        handler = function() {
            queue.waitforExcuteNumber = queue._queue.length; //记录之前push到queue队列中的个数
            _foreachImg(function(img, index) {
                if (_isInview(img)) {
                    var originUrl = img.getAttribute(self.imgAttribute);
                    if (img.loadstatus) {
                        // 只要设置过img.loadstatus就表示 已经给img对应的image绑定过了onload和onerror事件 
                        return;
                    }
                    img.loadstatus = 'pending';
                    // console.log("queue push: ", img.getAttribute('data-num'));
                    var image = new Image();
                    image.onload = function() {
                        console.log("       onload: ",img.getAttribute("data-num"))
                        img.src = originUrl;
                        img.removeAttribute(self.imgAttribute);
                        img.setAttribute("data-imglazy", "lazyed");
                        img.loadstatus = 'resolve';
                        if (self.showAnimation == 'fade') { //默认动画fade
                            animation(img, {
                                opacity: 0
                            }, {
                                opacity: 1
                            }, 1000);
                        }
                        queue.lock=false;
                        self.ordinal && queue.next();
                    };
                    image.onerror = function() {
                        img.src = self.errorImg;
                        img.removeAttribute(self.imgAttribute);
                        img.setAttribute("data-imglazy", "lazyed");
                        img.loadstatus = 'reject';
                        queue.lock=false;
                        self.ordinal && queue.next();
                    }
                    // debugger;
                    queue.push((function(image, originUrl, img) {
                        return function() {
                            console.log("loading ", img.getAttribute('data-num'));
                            image.src = originUrl;
                        }
                    })(image, originUrl,img));
                }
            });
            //  确保这次handle执行之前的 队列已经执行完毕(不包括这次handle新push的)
            if (queue.waitforExcuteNumber == 0 && self.ordinal) {
                queue.next(); 
            } else if (!self.ordinal) {
                queue._queue.forEach(function(fn) {
                    fn && fn();
                });
            }
        };

        // 初始化的一些设置
        _foreachImg(function(img) {
            img.src = self.placeholderImg;
            img.style.transformStyle = "preserve-3d";
            img.style.backfaceVisibility = "hidden";
            img.setAttribute("data-imglazy", "lazying");
        });

        // 用于初始化
        handler();  

        var scrolldom;
        if (loadimgs.length == 0) {
            return;
        }
        scrolldom = loadimgs[0].parentElement;
        while (scrolldom.nodeName.toLocaleLowerCase() != "html") { //  需要判断所有需要懒加载的图片的父级,如果父级可滚动，并且发生滚动时就应该判断是否应该加载图片
            if (window.getComputedStyle(scrolldom, null).overflow != 'hidden') {
                scrolldom.addEventListener("scroll",throttle(handler,100), false);
            }
            scrolldom = scrolldom.parentElement;
        }
    }
    window.imgLazyload = imgLazyload;
})();
