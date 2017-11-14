function Middleware(){
  this.tasks = [];
}

Middleware.prototype.use = function(fn){
  if(typeof fn !== 'function'){
    throw 'middleware must be a function';
  }
  this.tasks.push(fn);
  return this;
}

Middleware.prototype.next = function(){
  if(this.tasks && this.tasks.length > 0 ){
    var fn = this.tasks.shift();
    fn.call(this, this.next.bind(this));
  }
}

var middleware = new Middleware();
middleware.use(function(next){
  console.log(1);
  next();
  console.log('1结束');
});
middleware.use(function(next){
   console.log(2);
   next();
   console.log('2结束');
});
middleware.next();