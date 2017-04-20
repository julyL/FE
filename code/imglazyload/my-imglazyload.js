/*
	实现功能罗列：
	可以在指定container中实现 图片懒加载
	实现可选的显示动画

 */
(function() {
	var querySe=function(){return document.querySelector.call(document,arguments[0])},
		queryAll=function(){ return document.querySelectorAll.call(document,arguments[0])};
	function throttle(fn,time){
		return function(){
			fn();
		}
	}

	function isInView(img){   // 判断图片是在可视区域
    	var imgPosition=offset(img);
    	if(imgPosition.top+){

    	}
	}
	function offset(el){      // 获取图片距离window视口的位置信息
		var obj = el.getBoundingClientRect();
        return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: obj.width,
            height: obj.height
        };
	}
    var imgLazyload = function(config) {
    	var container,      // 容器
    		containerPosition,      // 容器的位置信息
    		handler,
    		loadimgs,       // 需要处理的图片dom集合
    		loadimgsArr,	// 将loadimgs转换为数组


    		i;
    	this.container=config.container||"body";
    	this.imgAttribute=config.imgAttribute||"data-original";
    	this.distance=config.distance||0;
    	this.loadingAction=config.loadingAction||"default";    // 默认是 图片距离视图distance时就加载图片     

    	container=querySe(this.container);
    	containerPosition=offset(container);

    	var scrolldom=container;
    	while(scrolldom.nodeName.toLocaleLowerCase!="body"){
    		if(window.getComputedStyle(scrolldom, null).overflow!='hidden'){
    			scrolldom.addEventListener("scroll", handler,false);
    		}
    		scrolldom=scrolldom.parentElement;
    	}

    	var self=this;
    	handler=throttle(function(){

	    	// 是否在handler中更新 loadimgs的值，这样可以减少isInView(img) 的判断 具体性能优劣待测试
	    	loadimgs=container.queryAll("img["+this.imgAttribute+"]");     
	    	loadimgsArr=[].slice.call(loadimgs);

    		loadimgsArr.forEach(function(img,index){
    			if(isInview(img)){
    				img.src=img.getAttribute(self.imgAttribute);
    				img.removeAttribute(self.imgAttribute);
    			}

    		});
    	});
    }   

})();
