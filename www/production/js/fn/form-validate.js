let vali = {};
vali.isphone = function(str){
	return /^1[3|4|5|7|8][0-9]\d{8}$/.test(str);
}
vali.ismail=function(str){
	return /^[^\.@]+@[^\.@]+\.[a-z]+$/.test(str);
}
vali.isnull=function(str){
	return str.trim()==false;
}
export default vali;
