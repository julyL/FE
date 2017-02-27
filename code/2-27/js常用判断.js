function isNumber(n){
    return n===+n;
}

function isArray(arr) {  
  return Object.prototype.toString.call(arr) === '[object Array]';   
}


//Date,RegExp,Bollean,Null,String,Number,undefined等都对Object.toString()进行了重写 

Object.prototype.toString.call(true)==='[object Boolean]'
Object.prototype.toString.call(new Date())==='[object Date]'
Object.prototype.toString.call(/\d/g)==='[object RegExp]'
Object.prototype.toString.call(null)==='[object Null]'
Object.prototype.toString.call(undefined)==='[object Undefined]'
// ...


typeof  "12.345".toFixed(1) === "string"

!!-1 ===true    //数字中只有    !!0===false

// 字符串中只有 "1"==true, 只有""和"0"==false
// "abc"!=true   "abc"!=false