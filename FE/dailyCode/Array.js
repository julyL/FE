if (!Array.prototype.some)
{
  Array.prototype.some = function(fun /*, thisArg */)
  {
    'use strict';

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function')
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisArg, t[i], i, t))
        return true;
    }

    return false;
  };
}


// self 
// Array.prototype.some = Array.prototype.some||function(fn, thisArg) {
//     var array = this,
//         len = array.length,
//         copyArr,
//         i=0;
//     for (; i < len; i++) {
//         copyArr=array.concat([]);
//         if(i in copyArr ){
//             if (!!fn.call(thisArg,copyArr[i],i,copyArr)) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }

