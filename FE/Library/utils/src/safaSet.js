/**
 * @param {处理的对象} obj 
 * @param {路径:数组或者字符串} path 
 * @param {设置的值} val 
 * @param {当键值为正数字时,生成数组覆盖} toArray 
 * var obj1={a:1};
 * safeSet(obj1,'b.c[1]',2)  => {a:1,b:{c:{"1":2}}}
 * safeSet(obj1,'b.c[1]',2,true)  => {a:1,b:{c:[,2]}}
 * 
 * var obj2={};
 * safeSet(obj2,'1','wtf')  => {"1":'wtf'}
 * safeSet(obj2,'1','wtf',true)  => {1:'wtf'} // 只有当取的key值的父级(obj2)不为对象时,并且newArrayIfNeed==true 才会新建数组
 * 
 * var obj3=2;
 * safeSet(obj2,'1','wtf')  => {"1":'wtf'}
 * safeSet(obj2,'1','wtf',true)  => ["1":'wtf']
 * 
 * 思路:
 * obj表示对象  k:表示key  result:需要赋值的值
 * * 判断能否取值 obj    (代码A)
 *      * 能取值
 *              * obj[k]是否存在 
 *                    * 存在       
 *                          *  obj[k]不是引用对象   (代码C)
 *                                * 是否是最后一个key
 *                                      * 是,obj[k]=result
 *                                      * 不是
 *                                          *根据下一个key值和newArrayIfNeed  obj[k]={}或[] 重复A
 *                          *  obj[k]是引用对象   下一个key?ob=obj[k]并重复A: obj[k]=result                 
 *                    * 不存在
 *                          *  是否是最后一个key
 *                                      * 是,obj[k]=result
 *                                      * 不是
 *                                          *根据下一个key值和newArrayIfNeed  obj[k]={}或[] 重复A=result 
 *      * 不能取值   (代码B)
 *             * 根据key值和newArrayIfNeed  obj[k]={}或[]  下一个key?ob=obj[k]并重复A: obj[k]=result 
 * 
 */
function _newObjorArray(key, newArrayIfNeed) {
  if (newArrayIfNeed && parseInt(key) == key && /^(([1-9]\d*)|0)$/.test(key)) {
    return new Array(parseInt(key)); //  new Array("1") => ["1"]    -_-!!!
  } else {
    return {};
  }
}

function safeSet(obj, path, result, newArrayIfNeed) {
  if (Array.isArray(path)) {
    var ob = obj,
      ArrayObj = [];
    for (var i = 0, len = path.length; i <= len - 1; i++) {
      if (typeof ob == "object" && ob != null) {
        ArrayObj.push(ob);
        val = ob[path[i]];
        if (val) {
          if (typeof val == "object") {
            //(代码C)
            ob[path[i]] = val;
            ob = ob[path[i]];
          } else {
            //
            if (i == len - 1) {
              ob[path[i]] = result;
              ob = ob[path[i]];
            } else {
              ob[path[i]] = _newObjorArray(path[i + 1], newArrayIfNeed);
              ob = ob[path[i]];
            }
          }
        } else {
          if (i == len - 1) {
            ob[path[i]] = result;
            ob = ob[path[i]];
          } else {
            ob[path[i]] = _newObjorArray(path[i + 1], newArrayIfNeed);
            ob = ob[path[i]];
          }
        }
      } else {
        // (代码B)
        ob = _newObjorArray(path[i], newArrayIfNeed);
        ArrayObj.push(ob);
        ob[path[i]] = val;
      }
    }
    return ArrayObj[0];
  } else if (typeof path == "string") {
    var arrKeys = path.split("."),
      keys = [],
      m;
    arrKeys.forEach(k => {
      if ((m = k.match(/([^\[\]]+)|(\[\d+\])/g))) {
        m = m.map(v => v.replace(/\[(\d+)\]/, "$1"));
        [].push.apply(keys, m);
      }
    });
    return safeSet(obj, keys, result, newArrayIfNeed);
  }
}

//var// obj1 = { a: 1 };
// safeSet(obj1,'b.c[1]',2)
// safeSet(obj1,'b.c[1]',2,true) // => {a:1,b:{c:[,2]}}

//var obj2 = {};
// safeSet(obj2,'1','wtf') // => {"1":'wtf'}
// safeSet(obj2,'1','wtf',true) // => {1:'wtf'} // 只有当取的key值的父级(obj2)不为对象时,并且newArrayIfNeed==true 才会新建数组

//var obj3 = 2;
// safeSet(obj2,'1','wtf')  //=> {"1":'wtf'}
//safeSet(obj3, "1", "wtf", true); //=> ["1":'wtf']
export default safeSet;
