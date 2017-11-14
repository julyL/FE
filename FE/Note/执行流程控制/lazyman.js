// 实现一个LazyMan，可以按照以下方式调用:
// LazyMan("Hank")输出:
// Hi! This is Hank!

// LazyMan("Hank").sleep(10).eat("dinner")输出
// Hi! This is Hank!
// //等待10秒..
// Wake up after 10
// Eat dinner~

// LazyMan("Hank").eat("dinner").eat("supper")输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~

// LazyMan("Hank").sleepFirst(5).eat("supper")输出
// //等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper

function LazyMan(name){
	if(!(this instanceof LazyMan)){
		return new LazyMan(name);
	}
	this.name=name;
	this.tasks=[(next)=>{         // 必须手动绑定this的指向或者采用箭头函数
		console.log("Hi This is "+this.name);
		next();
	}]
	setTimeout(()=>{
		this.next();
	})
}
LazyMan.prototype={
	constructor:LazyMan,   	//不设置的话  LazyMan.prototype.constructor===Object
	next(){
		if(this.tasks.length){
			var fn=this.tasks.shift();
			fn(this.next.bind(this));
			(function(){console.log(this)})(); // window
		}	
	},
	sleep(time){
		this.tasks.push((next)=>{
			setTimeout(()=>{
				console.log('Wake up after '+time);
				next();
			},time)		
		})
		return this;
	},
	eat(f){
		this.tasks.push((next)=>{
			console.log("Eat "+f);
			next();
		})
		return this;
	},
	sleepFirst(time){
		this.tasks.unshift((next)=>{
			setTimeout(()=>{
				console.log('Wake up after '+time);
				next();
			},time)		
		})
		return this;
	}
}

// LazyMan("Hank")
// LazyMan("Hank").sleep(10).eat("dinner")
// LazyMan("Hank").eat("dinner").eat("supper")
LazyMan("Hank").sleepFirst(5).eat("supper")

