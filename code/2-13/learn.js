var a=new Promise((re)=>{
	console.log(1);
	re();
})
a.then(()=>{
	console.log(2);
})
console.log(3)
//   1  3  2