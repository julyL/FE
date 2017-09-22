/**
 * 不知道对象结构时取值时,一般会采用 obj&&obj[0]&&obj.name的方法,等价于下面的方法
 *  f(obj,'[0].name') === f(obj,['0','name'])
 * @param {取值的对象} obj 
 * @param {用于取值的字符串或者数组} path 
    var testData = { a: [{ c: { b: [233] } }] };
    safeGet(testData,'a[0].c.b[0]') => 233
    safeGet(testData,['a','0','c','b','0']) => 233
 */
function safeGet(obj, path) {
  if (Array.isArray(path)) {
    return path.reduce((ob, k) => {
      return ob && ob[k] ? ob[k] : undefined;
    }, obj);
  } else if (typeof path == "string") {
    var arrKeys = path.split("."),
      keys = [],
      m;
    arrKeys.forEach(k => {
      if ((m = k.match(/([^\[\]]+)|(\[\d+\])/g))) {
        // arr[3][2] =>  ['arr',[3],[2]]
        m = m.map(v => v.replace(/\[(\d+)\]/, "$1"));
        // ['arr',[3],[2]] => ['arr','3','2']
        [].push.apply(keys, m);
      }
    });
    return safeGet(obj, keys);
  }
}
export default safeGet;
