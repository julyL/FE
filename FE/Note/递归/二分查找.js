
// 假的二分查找 (不要求数组有序)
function fn(arr,val){
	var len=arr.length,
		iseven=len%2==0;
	if(len==1){
		return arr[0]==val;
	}
	if(iseven){   		//偶数
		return fn(arr.slice(0,len/2),val)||fn(arr.slice(len/2,len),val);
	}else {	
		return fn(arr.slice(0,(len-1)/2),val)||fn(arr.slice((len-1)/2+1,len),val)||arr[(len-1)/2]==val;
	}
}


/*  
	递归结束的条件:
	   true:   找到了
	   false:  小于arr[0] || 大于arr[len-1] 
 */ 
function fn1(arr,val){
	var len=arr.length,
		middle=Math.floor(len/2);

		if(arr[middle]==val){
			return true;
		}else if(arr[middle]>val){
			return middle==0?false:fn1(arr.slice(0,middle),val)
		}else{
			return middle==len-1?false:fn1(arr.slice(middle,len-1),val);
		}
}

/*
	递归结束的条件:
		1.找到了
		2.数组长度为1,就直接返回return  arr[0]==val;
*/ 
function fn2(){
	var len=arr.length,
	middle=Math.floor(len/2);
	if(len==1){
		return arr[0]==val;
	}
	if(arr[middle]==val){
		return true;
	}else if(arr[middle]>val){
		return fn1(arr.slice(0,middle),val);
	}else {
		return fn1(arr.slice(middle,len-1),val);
	}
}


var arr=[15,17,20,23,25,26,27,53,63,99];
fn(arr,23)
fn1(arr,23)