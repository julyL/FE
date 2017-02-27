function isNumber(n){
    return n===+n;
}
!!-1 ===true    //数字中只有    !!0===false
function isArray(arr) {  
  return Object.prototype.toString.call(arr) === '[object Array]';   
}

// Array对象对toString进行了重写, [1,2].toString()==='1,2' 

Date,RegExp,Bollean,Null,String,Number,undefined等都对Object.toString()进行了重写 (没有重写的话,都会输出'[object Object]');

Object.prototype.toString.call(true)==='[object Boolean]'
Object.prototype.toString.call(new Date())==='[object Date]'
Object.prototype.toString.call(/\d/g)==='[object RegExp]'
Object.prototype.toString.call(null)==='[object Null]'
Object.prototype.toString.call(undefined)==='[object Undefined]'
// ...

Array.isArray(array)===true


// 字符串中只有 "   1"==true,只有"","0"==false
// "abc"!=true   !"abc"==false


typeof  "12.345".toFixed(1) === "string"