var obj = {
  foo: {
    name: [
      2, 3
    ],
    bar: {
      name: 'bar',
      baz: {
        name: 'baz',
        aChild: null // 待会将指向obj.bar
      }
    }
  }
}
obj.foo.bar.baz.aChild = obj.foo.name // foo->bar->baz->aChild->foo形成环
// JSON.stringify(obj);

function cycleDetector(obj) {
  var result = [],
    iscycle = false;
  (function iterator(obj) {
    for (var i in obj) {
      var o = obj[i];
      if (obj.hasOwnProperty(i)) {
        if (typeof o === 'object') {   // 只要是对象，就会出现共同引用的情况
          if (result.indexOf(o) != -1) {
            iscycle = true;
            break;
          } else {
            result.push(o);
            iterator(o);
          }
        }
      }
    }
  })(obj);
  return iscycle;
}
cycleDetector(obj);