let Location={};
Location.get=function(key,location){
	var location=location||window.location.href;
	var params=location.split("?"),
		result;
	if(params.length>1){
		params[1].split("&").some((kv)=>{
			var p=kv.split("=");
			if(p[0]==key){
				result=p[1];
				return true;
			}
		})
	}
	return result;
}
Location.remove=function(key,str){        //取出url中的字段    ?key1=val&key2=val2      Location.remove(key1,"?key1=val&key2=val2")  =>?key2=val2
   var reg=new RegExp("("+key+"=.*?&)|(&"+key+"=.*?(?=&))|(&"+key+"=.*)",'gi');
   return str.replace(reg,'')	
}
export default Location;