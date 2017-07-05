function isLikeObject(val){
    return Object.prototype.toString.call(val)=="[object Object]";
}	
function isArray(val){
	return Object.prototype.toString.call(val)=="[object Array]";
}
function copy(deep,target,source){
	var isdeep=false,	//默认浅拷贝
		_target,
		_source;
	if(typeof deep=="boolean"){   // 传的第一个值是否为true or false
		isdeep=deep;
		_target=target;
		_source=Array.prototype.slice.call(arguments,2);
	}else{
		_target=deep;
		_source=Array.prototype.slice.call(arguments,1);
	}
	if(!isLikeObject(_target)){
		throw new Error("target is not a ObjectLike");
	}else{
		_source.forEach(function(currentObj,index){
			if(!isLikeObject(currentObj)){
				return;
			}
			for(var i in currentObj){
				if(isdeep&&currentObj.hasOwnProperty(i)&&(isArray(currentObj[i])||isLikeObject(currentObj[i]))){
					_target[i]=copy(true,_target[i]?_target[i]:(isArray(currentObj[i])?[]:{}),currentObj[i]);
				}else{
					_target[i]=currentObj[i];
				}
			}
		})
	}
	return _target;
}
var obj={
    age:11,
    a:{
        name:22
    }
} 
var c=copy(true,{},obj);