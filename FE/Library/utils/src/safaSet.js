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
 */

function safeSet(obj, path, val, newArrayIfNeed = false) {
  if (Array.isArray(path)) {
    var ob;
    for (var i = 0, len = path.length; i < len; i++) {
      ob = ob[i];
      if (typeof ob != "object" || ob == null || ob == undefined) {
        // 无法取值的情况
        if (toArray && parseInt(k) == k && /^(([1-9]\d*)|0)$/.test(k)) {
          // k为整张数&&toArry,则初始化数组
          ob = new Array(k);
        } else {
          // 初始化对象
          ob = {};
        }
      }
    }
    ob = val;
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
    return safeGet(obj, keys, val);
  }
}
export default safeSet;
