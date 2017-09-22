
function safeSet(obj,path,toArray=true) {
    if (Array.isArray(path)) {
         path.forEach(v=>{
             if(toArray&&+v==v){
                 
             }
         })           
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
        return safeGet(obj, keys);
      }
}
export default safeSet;