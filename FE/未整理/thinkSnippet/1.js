function extend(Sub,Sup) {
	//Sub表示子类，Sup表示超类
	// 首先定义一个空函数
	var F = function(){};

	// 设置空函数的原型为超类的原型
	F.prototype = Sup.prototype; 

	// 实例化空函数，并把超类原型引用传递给子类
	Sub.prototype =new F();             
	//  Q: 能不能换成  Sub.prototype=Sup.prototype;
	//  R: 不太好, Sub.prototype=Sup.prototype的写法更类似于一种重写  而Sub.prototype =new F()当实例上查找不到时,在其原型链上查找更加符合继承的思想。

	// 重置子类原型的构造器为子类自身
	Sub.prototype.constructor = Sub;
}
function A(){
	this.a='111';
}
function B(){
	this.b='222';
}
B.prototype.c=33;
extend(A,B);
var a=new A();
console.log(a.c);