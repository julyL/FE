/*
	$(".a").addClass("red").addClass("fz20");
	
	1.链式调用


*/


var _$ = function() {};
var $ = function(str) {
    var $dom = new _$();
    $dom.dom = document.querySelector(str);
    return $dom;
};
_$.prototype.addClass = function(cname) {
    var el = this.dom;
    var classname = el.className.trim();
    var classNameArr = classname.split(" ").filter(function(v) {
        return v !== ' ';
    });
    if (classNameArr.indexOf(cname) == -1) {
        el.className = classname + " " + cname;
    }
    return this;
};
_$.prototype.removeClass = function(cname) {
    var el = this.dom;
    var classname = el.className.trim();
    var classNameArr = classname.split(" ").filter(function(v) {
        return v !== ' ';
    });
    // var removeIndex=classNameArr.indexOf(cname);     //只会删除一个className
    // if(removeIndex!=-1){
    // 	classNameArr.splice(removeIndex,1);
    // 	el.className=classNameArr.join(" ");
    // }

    el.className = classNameArr.filter(function(v) {
        return v == cname ? false : true;
    }).join(" ");

    return this;
}
_$.prototype.offset = function() {
	var el=this.dom;
    var rect = el.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }

}
