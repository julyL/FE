function fn(str){
	if(str.length<=1){		// 递归结束的条件
		return true;
	}else if(str[0]==str[str.length-1]&&fn(str.slice(1,-1))){   // 分解成更小规模的问题
		return true;	
	}else{
		return false;
	}
}
// fn("abcdcba") => true









