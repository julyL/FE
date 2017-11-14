Function.prototype.bind = Function.prototype.bind || function (context) {
    var me = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var F = function () {};
    F.prototype = this.prototype;
    var bound = function () {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return me.apply(this instanceof F ? this : context || this, finalArgs);  // 1.0
    }
    bound.prototype = new F();  //关键  使得1.0中的 this instanceof F === true
    return bound;
}
//  var obj=new someFn.bind(bindObj)();     obj.__proto__ ==bound.protytye == new F()[A]  
//    [A].__proto__==F.prototye==someFn.protytype
