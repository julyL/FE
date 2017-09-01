
// 假的二分查找
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
	真二分查找
	递归结束的条件：
	   true: 找到
	   false:  <arr[0] || >arr[len-1] 
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


var arr=[15,17,20,23,25,26,27,53,63,99];
fn(arr,23)
fn1(arr,23)