/*
	抽奖
*/
function mylottery(sum,num){    // 随机从sum中抽取num个
	var sumarr=[],
		i=sum,
		arr=[];
	while(i--){
		sumarr[i]=i+1;
	}
	while(num--){
		arr.push(sumarr.splice(Math.floor(Math.random(sumarr.length)*sumarr.length),1)[0])
	}
	return arr.sort((a,b)=>{
	    return a-b;
	});
}
mylottery(100,10);


/*

 */ 
function Box(amount){
    this.cards = Array(amount).fill().map((_,i)=>i+1); 
}
Box.prototype.draw = function(n = 1){
    let amount = this.cards.length, cards = this.cards;

    for(let i = amount - 1, stop = amount - n - 1; i > stop; i--){
        let rand = Math.floor((i + 1) * Math.random());
        [cards[rand], cards[i]] =  [cards[i], cards[rand]];
    }

    let ret = cards.slice(-n);    
    cards.length = amount - n;

    return ret;
}

var box = new Box(62);
console.log(box.draw(5), box.draw(5)); //一次取 5 个，取 2 次