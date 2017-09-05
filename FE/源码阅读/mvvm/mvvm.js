/*
  think: 
    实现一个mvvm需要做哪些事?
    1. 将页面中的自定义指令(v-model v-html 和{{}}) 替换成data中相应的值(视图更新)     第一次视图更新时,需要关联视图和数据,这样数据变化才知道更新哪些视图
        1.1 如何关联视图和数据?     每一个key中都有一个dep实例,dep存有相应的更新视图的"方法"。当key发生改变,会触发dep.notify进行广播,执行所有相应的"方法"
    2. 如果指令是事件指令@click,则绑定原生的事件
 */

// Define Property
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    configurable: true,
    writable: true
  })
}

/**
 * @class 双向绑定类 MVVM
 * @param {[type]} options [description]
 */
function MVVM (options) {
  this.$options = options || {};
  let data = this._data = this.$options.data;
  let self = this;

  Object.keys(data).forEach(key => {   
    self._proxyData(key);
  });
  observe(data, this);    // 遍历data,设置每个key的get和set,并设置一个dep实例
  new Compile(options.el || document.body, this);  //遍历el的html树结构  -> 解析el中的自定义指令  ->  根据相应data的值来初始化视图  ->  为每个指令实例化一个watcher对象 
}
MVVM.prototype = {
  _proxyData: function (key) {
    let self = this;
    setter = Object.defineProperty(self, key, {   
    // vm.datakey=val  =>  vm._data.datakey=val;  形成映射关系(datakey为vm的data属性里面的key)
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return self._data[key];
      },
      set: function proxySetter(newVal) {
        self._data[key] = newVal;
      }
    })
  },
  $set: set,
  $delete: del
}
function set (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val;
  }
  let ob = (target).__ob__;
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}
function del (target, key) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1);
    return;
  }
  let ob = (target).__ob__;
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}
// observe array
let arrayProto = Array.prototype;
let arrayMethods = Object.create(arrayProto);
[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(method => {
  let original = arrayMethods[method];   // 原始方法
  def(arrayMethods, method, function () {
    let arguments$1 = arguments;
    let i = arguments.length;
    let args = new Array(i);

    while (i--) {
      args[i] = arguments$1[i]
    }
    // 执行数组方法
    let result = original.apply(this, args);
    // 因 arrayMethods 是为了作为 Observer 中的 value 的原型或者直接作为属性，所以此处的 this 一般就是指向 Observer 中的 value
    // 当然，还需要修改 Observer，使得其中的 value 有一个指向 Observer 自身的属性，__ob__，以此将两者关联起来
    let ob = this.__ob__;
    // 存放新增数组元素
    let inserted;
    // 为add 进arry中的元素进行observe
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // 第三个参数开始才是新增元素
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // 通知数组变化
    ob.dep.notify();
    // 返回新数组长度
    return result;
  })

})
// arrayMethods所有的枚举属性名
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
// 判断当前环境是否可以使用 __proto__
const hasProto = '__proto__' in {};
console.log(arrayMethods)
// 直接将对象的 proto 指向 src这一组方法
function protoAugment (target, src) {
  target.__proto__ = src;
}

// 遍历这一组方法，依次添加到对象中，作为隐藏属性（即 enumerable: false，不能被枚举）
function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    let key = keys[i];
    def(target, key, src[key]);
  }
}
// 返回一个布尔值，指示对象是否具有指定的属性作为自身（不继承）属性
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

function observe(value) {     // 当传入的value为对象时,返回Observer实例
  if (!value || typeof value !== 'object') {
    return;
  }
  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {    // 当value为Observer实例时,直接返回Obsever实例
    ob = value.__ob__;
  } else  {
    ob = new Observer(value);
  }
  return ob
}

function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  def(value, '__ob__', this);   //  在__ob__上存储this,用来标示当前value已通过new Observer(value)实例化
  if (Array.isArray(value)) {  
    let augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
}

Observer.prototype = {
  walk: function (obj) {
    let self = this;
    Object.keys(obj).forEach(key => {
      defineReactive$$1(obj, key, obj[key]);
    });
  },
  observeArray: function (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function defineReactive$$1 (obj, key, val) {
  let dep = new Dep();      //dep 负责执行“事件”的订阅和发布 (vm.data中的key值都对应一个dep实例,当key对应的val发生改变,会执行updaterFn来更新视图)   updaterFn也就是watcher实例中的cb(在初始化执行Compile时绑定的回调)
  let childOb = observe(val);  //递归处理
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      // Dep.target用于存储临时的watcher对象
      if (Dep.target) {    //  Dep.target只有2种情况下会有值:  1.初始化watcher对象时(执行compiler)  2.watcher对象执行update方法时(触发了setter)   这2种情况都需要关联dep对象和watcher
        dep.depend();      //  在dep.subs中加入watcher对象     dep对象(发布者,执行notify方法通知watcher进行视图更新)  <==>  watcher对象(订阅者,执行update方法进行视图更新)
        if (childOb) {     //  当key的val值为对象时,父级子级绑定同一个watcher对象
          childOb.dep.depend();
        }
      }
      return val;
    },
    set: function(newVal) {
      debugger;
      if (val === newVal || (newVal !== newVal && val !== val)) {   // 值相等 或者 为NaN的情况不需要更新
        return;
      }
      val = newVal;
      // 监听子属性
      childOb = observe(newVal);    // newVal可能是对象,需要重新observe
      // 通知数据变更
      dep.notify();
    }
  })
}

let uid = 0;
function Dep() {        
  this.id = uid++;    // dep id
  this.subs = [];     // array 存储Watcher
}
Dep.target = null;
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  removeSub: function (sub) {
    let index = this.subs.indexOf(sub);
    if (index !== -1) {
      this.subs.splice(index ,1);
    }
  },
  // 通知数据变更
  notify: function () {
    console.log('notify');
    this.subs.forEach(sub => {
      sub.update();    // 执行sub的update更新函数
    });
  },
  // add Watcher
  depend: function () {
    Dep.target.addDep(this);
  }
}

/**
 * @class 观察类
 * @param {[type]}   vm      [vm对象]
 * @param {[type]}   expOrFn [属性表达式]
 * @param {Function} cb      [回调函数(一半用来做view动态更新)]
 */
function Watcher(vm, expOrFn, cb) {
  this.vm = vm;
  expOrFn = expOrFn.trim();
  this.expOrFn = expOrFn;
  this.cb = cb;       //更新视图的方法
  this.depIds = {};

  if (typeof expOrFn === 'function') {      // 为指令事件时  @click="submit"   exp="submit"
    this.getter = expOrFn
  }
  else {                                    // x-model="a.b"    exp="a.b"
    this.getter = this.parseGetter(expOrFn);
  }
  this.value = this.get();
}
Watcher.prototype = {
  update: function () {
    this.run();
  },
  run: function () {
    let newVal = this.get();
    let oldVal = this.value;
    if (newVal === oldVal) {
      return;
    }
    this.value = newVal;
    // 将newVal, oldVal挂载到MVVM实例上
    this.cb.call(this.vm, newVal, oldVal);
  },
  get: function () {
    debugger;
    Dep.target = this;  // 将当前订阅者指向自己
    let value = this.getter.call(this.vm, this.vm); // 触发getter，将自身添加到dep中
    Dep.target = null;  // 添加完成 重置
    return value;
  },
  // 添加Watcher to Dep.subs[]
  addDep: function (dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },
  parseGetter: function (exp) {
    if (/[^\w.$]/.test(exp)) return;

    let exps = exp.split('.');

    // 简易的循环依赖处理
    return function(obj) {
      debugger;
        for (let i = 0, len = exps.length; i < len; i++) {  //循环取值  eg:  exp="a.b"   先往a对应的dep中push当前watcher对象, 再往b对应的dep中push当前watcher对象
            if (!obj) return;
            obj = obj[exps[i]];    // 这里会触发getter,从而关联watcher和dep
        }
        return obj;
    }
  }
}

/**
 * @class 指令解析类 Compile
 * @param {[type]} el [element节点]
 * @param {[type]} vm [mvvm实例]
 */
function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  if (this.$el) {
    this.$fragment = this.nodeFragment(this.$el);    // 用DocumentFragment存储el中的html
    this.compileElement(this.$fragment);
    this.$el.appendChild(this.$fragment);            // 将文档碎片放回真实dom   
  }
}
Compile.prototype = {
  compileElement: function (el) {
    let self = this;
    let childNodes = el.childNodes;
    [].slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{((?:.|\n)+?)\}\}/;    

      // 如果是element节点
      if (self.isElementNode(node)) {
        self.compile(node);
      }
      // 如果是text节点
      else if (self.isTextNode(node) && reg.test(text)) {
        // 匹配第一个选项
        self.compileText(node, RegExp.$1);
      }

      // 递归解析子节点
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    });
  },
  // 文档碎片，遍历过程中会有多次的dom操作，为提高性能我们会将el节点转化为fragment文档碎片进行解析操作
  // 解析操作完成，将其添加回真实dom节点中
  nodeFragment: function (el) {
    let fragment = document.createDocumentFragment();
    let child;

    while (child = el.firstChild) {
      fragment.appendChild(child);
    }
    return fragment;
  },
  // 指令解析
  compile: function (node) {
    let nodeAttrs = node.attributes;   //获得属性数组
    let self = this;

    [].slice.call(nodeAttrs).forEach(attr => {    //  遍历属性数组,对其中的自定义指令进行解析(compileUtil),并通过removeAttribute删除自定义属性
      let attrName = attr.name;                   //  attrName="x-model"
      if (self.isDirective(attrName)) {
        let exp = attr.value;                     //  exp='a'
        let dir = attrName.substring(2);          //  dir='model'
        // 事件指令
        if (self.isEventDirective(dir)) {
          compileUtil.eventHandler(node, self.$vm, exp, dir);
        }
        // 普通指令
        else {
          compileUtil[dir] && compileUtil[dir](node, self.$vm, exp);
        }
        node.removeAttribute(attrName);
      }
    });
  },
  // {{ test }} 匹配变量 test
  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },
  // element节点
  isElementNode: function (node) {
    return node.nodeType === 1;
  },
  // text纯文本
  isTextNode: function (node) {
    return node.nodeType === 3
  },
  // x-XXX指令判定
  isDirective: function (attr) {
    return attr.indexOf('x-') === 0;
  },
  // 事件指令判定
  isEventDirective: function (dir) {
    return dir.indexOf('on') === 0;
  }
}
// 定义$elm，缓存当前执行input事件的input dom对象
let $elm;
let timer = null;
// 指令处理集合
const compileUtil = {
  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class');
  },
  model: function(node, vm, exp) {    //  exp='a' data中的key
    this.bind(node, vm, exp, 'model');

    let self = this;
    let val = this._getVmVal(vm, exp);
    // 监听input事件
    node.addEventListener('input', function (e) {
      let newVal = e.target.value;
      $elm = e.target;
      if (val === newVal) {
        return;
      }
      // 设置定时器  完成ui js的异步渲染
      clearTimeout(timer);
      timer = setTimeout(function () {
        self._setVmVal(vm, exp, newVal);
        val = newVal;
      })
    });
  },
  bind: function (node, vm, exp, dir) {
    let updaterFn = updater[dir + 'Updater'];                 // 根据dir返回相应更新视图的方法
    updaterFn && updaterFn(node, this._getVmVal(vm, exp));    // 进行视图的初始化

    new Watcher(vm, exp, function(value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  // 事件处理
  eventHandler: function(node, vm, exp, dir) {
    let eventType = dir.split(':')[1];
    let fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  _getVmVal: function (vm, exp) {
    // debugger;
    let val = vm;
    exp = exp.split('.');
    exp.forEach(key => {
      key = key.trim();
      val = val[key];
    });
    return val;
  },
  _setVmVal: function (vm, exp, value) {
    let val = vm;
    exps = exp.split('.');
    exps.forEach((key, index) => {
      key = key.trim();
      if (index < exps.length - 1) {
        val = val[key];
      }
      else {
        val[key] = value;
      }
    });
  }
}
// 指令渲染集合
const updater = {
  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  },
  textUpdater: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  classUpdater: function () {},
  modelUpdater: function (node, value, oldValue) {
    if ($elm === node) {
      return false;
    }
    $elm = undefined;
    node.value = typeof value === 'undefined' ? '' : value;
  }
}