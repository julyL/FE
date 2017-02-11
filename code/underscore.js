(function() {
   /*   
      整个underscore的结构  
      (function(){
        ...
      }).call(this);      
      这里的this为外层环境中的this,并没有直接暴露到window对象上
   */
   var root = this;    
   var previousUnderscore = root._;     //  首先将外部this上的_ 存储下来以免进行了覆盖
   /*
       _.noConflict = function() {
          root._ = previousUnderscore;       //恢复之前保存的this._对象对控制变量"_"使用权利
          return this;                       //  返回underscore对象
        };
   */
   var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
   var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;
   var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;
   var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
   if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
   _.VERSION = '1.7.0';
   var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };
   _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;

    /* 
      value是functions时，除了soreIndex方法调用_.iteratrr传了argCount=1,
        其他都情况  _.iteratee=function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
    */
    if (_.isFunction(value)) return createCallback(value, context, argCount);   
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };
   _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);     //  =>    func.call(context, value, index, collection)
    var i, length = obj.length;
    if (length === +length) {    //  这里处理的是数组的情况  但没有过滤掉  obj={name:"Bob",length:233}  这种情况
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };
   _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),    //  keys只有为对象时，才有值
        length = (keys || obj).length,                       //  这两行代码虽然简单的,但很精妙 
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';
   _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
   _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
   _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };
   _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };
   _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };
   _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };
   _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };
   _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };
   _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };
   _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };
   _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };
   _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };


  /*
    var max=function(array,compareKey){
       return array.reduce(function(prev,value,index){
               return prev=prev[compareKey]<value[compareKey]?value:prev;
        },array[0])
    }
  */
   _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {                                     //   传了比较值
      iteratee = _.iteratee(iteratee, context);  // => ()=>{ iteratee.call(context, value, index, collection)}
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };
   _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };
   _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };
   _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };
   _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

   var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };
  //  _.groupBy,_.indexBy,_.countBy的特点都是返回一个key-value的分类对象,underscore将共通的部分抽象成了group函数
   _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });
   _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });
   _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });


   _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };
   _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };
   _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };
   _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };
   _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };
   _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };
   _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };
   _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };
   _.compact = function(array) {
    // _.identity本身功能简单，但是复用和函数式的思想很巧妙
    return _.filter(array, _.identity);
  };



  /*
  self:
  var flatten = function(input, shallow) {
        if (!Array.isArray(input)) {
            throw new Error("is not a Array");
        }
        var returnValue = [];
        input.forEach(function(val) {
            if (Array.isArray(val)) {
                [].push.apply(returnValue, shallow ? val : flatten(val));
            } else {
                returnValue.push(val);
            }
        });
  return returnValue;
}
ps：  lodash中默认是对数组中的元素只降一维，全部降维 采用 flattenDeep
      underscore是默认全部降维，flatten(input,true)只降一维
*/
   var flatten = function(input, shallow, strict, output) {
    // 这个if判断是对 只降一维 + input里的元素全部是数组 的情况的优化，这种情况可以直接利用cancat.apply直接获得结果
    // 去掉这个if也是ok的
    if (shallow && _.every(input, _.isArray)) {    
      /*
         如果input里的元素都是数组并且只降一维，
         直接用apply第二个参数可以接受数组，并且配合concat巧妙的降维
         [].concat.apply([],[[1,2,3],[4,5]])    =>  [1,2,3,4,5]
      */
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);         //不是数组直接push
      } else if (shallow) {
        push.apply(output, value);               //是数组，只降一维  利用apply特性降维   
      } else {                                   //是数组，全部降维  直接递归调用
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };
   _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };



   _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };
   _.uniq = _.unique = function(array, isSorted, iteratee, context) {     //_.uniq([2, 1, 2]);     // => [2, 1]
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {               //排序情况下只要 当前元素和前一个值不同就可以push，排除i=0的情况
        if (!i || seen !== value) result.push(value);   
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);   // 获取到要比较的值
        if (_.indexOf(seen, computed) < 0) {        //  seen  是之前所有要比较的值组成的数组
          seen.push(computed);                       
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };
   _.union = function() {    
    return _.uniq(flatten(arguments, true, true, []));     // 将arguments降维 取唯一值
  };
   _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;    
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

/*

  var difference=function(array){
    var args=arguments;
    var filterArray=[].concat.apply([],[].slice.call(args,1));
    return array.filter(function(val){
        return  filterArray.indexOf(val)==-1; 
    }); 
}
*/
   _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };


   _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;   //获取arguments中长度最长的数组的长度
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);     //取出每个arguments中对应的值
    }
    return results;
  };
   _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };
   _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };
   _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };
   var Ctor = function(){};

   /*
    屌丝版：
    Function.prototype.bind=Function.prototype.bind||function(context){
        var self=this;
        var args=[].slice.call(arguments,1);
        return function(){
            self.apply(context,[].concat.apply(args,arguments));
        }   
     }

   */
   _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

   _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];      // 占位符参数填充
      }
      //   arguments.length(函数实际传参个数)大于arguments.callee.length(函数定义参数个数) 的处理
      while (position < arguments.length) args.push(arguments[position++]);   
      return func.apply(this, args);
    };
  };
   _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };


   _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };
   _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };
   _.defer = function(func) {
    //  wait=1
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };




/*
//  节流    定时触发函数
//  v1.0    第一次执行也要等待wait
var throttle = function(func, wait) {
        var timer;
        return function() {
            if (timer) {
                return;
            } else {
                timer = setTimeout(function() {
                    func();
                    clearTimeout(timer);
                    timer = null;
                }, wait);
            }
        }
    }
    // v1.1   第一次是立刻执行, 可以通过设置 leading:false 禁用第一次执行
var throttle = function(func, wait, option) {
    var timer;
    option && (option.leading = option.leading || true);
    // option&&(option.leading=option.leading||true);
    return function() {
        if (option.leading === true) {
            func();
            option.leading = 'lock';
        }
        if (timer) {
            return;
        } else {
            timer = setTimeout(function() {
                func();
                clearTimeout(timer);
                timer = null;
            }, wait);
        }
    }
}

*/
   _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  /*
    将函数延迟到最后一次调用的wait之后再执行
    eg:  你希望用户在搜索框输入的同时发起ajax请求数据,不做处理用户的的每次输入都会发起ajax请求(会浪费大量请求)
     _.debounce(getResult,wait) 可以当用户输入wait之后再发起ajax请求

  简洁版：
    var debounce=(func,wait)=>{
      var timer;
      return ()=>{
            clearTimeout(timer);
            timer=setTimeout(()=>{
                func();
            },wait)
      }
    }

增加immediate:
  var debounce=(func,wait,immediate)=>{
    var timer,
        lasttime,
        nowtime;
    return ()=>{
         nowtime=+new Date();
         if(!immediate){
            clearTimeout(timer);
            timer=setTimeout(()=>{
              func();
            },wait)
         }else{
            if(!lasttime||nowtime>wait+lasttime){
               func();
            }
            lasttime=nowtime;
         }
    }
  }

  */

   _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;     //@B

      if (last < wait && last > 0) {   //  这里last>0  不需要判断吧？ 感觉last一定>0
        /*这里为什么要重新设定定时器？思考一下...
          
        */
          timeout = setTimeout(later, wait - last);    //  @C 
      } else {         //  进入这个else 有2种情况  1.   从@C进入,@C执行后last必定大于wait      2. wait的时间设置的特别短,导致  @A执行到@B的时间大于了wait (一般不会这么干的，这样做就失去了防抖的意义)
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;     //  上面都已经执行timeout=null;  感觉不需要判断
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();         //  @A 
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };
   _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };
   _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };
   _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };
   _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };
   _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };
   _.once = _.partial(_.before, 2);
   _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };
   _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };
   _.pairs = function(obj) {    //  _.pairs({name:"libo",age:23})   =>   [[name,"libo"],"age",23]
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };
   _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };
   _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };
   _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {            //  直接for in遍历arguments[n]  n>1 ,如果是自身属性(hasOwnProperty为真) 就直接覆盖obj
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };
   _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));     //  =>  slice.call(arguments,1)
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };
   _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };
   _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };
   _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };
   _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };
   var eq = function(a, b, aStack, bStack) {
     if (a === b) return a !== 0 || 1 / a === 1 / b;
     if (a == null || b == null) return a === b;
     if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
     var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
       case '[object RegExp]':
       case '[object String]':
         return '' + a === '' + b;
      case '[object Number]':
         if (+a !== +a) return +b !== +b;
         return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
         return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
     var length = aStack.length;
    while (length--) {
       if (aStack[length] === a) return bStack[length] === b;
    }
     var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
       'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
     aStack.push(a);
    bStack.push(b);
    var size, result;
     if (className === '[object Array]') {
       size = a.length;
      result = size === b.length;
      if (result) {
         while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
       var keys = _.keys(a), key;
      size = keys.length;
       result = _.keys(b).length === size;
      if (result) {
        while (size--) {
           key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
     aStack.pop();
    bStack.pop();
    return result;
  };
   _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };
   _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };
   _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };
   _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };
   _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

    //  写法值得学习  
   _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });
   if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }
   if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }
   _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };
   _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };
   _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };
   _.isNull = function(obj) {
    return obj === null;
  };
   _.isUndefined = function(obj) {
    return obj === void 0;
  };
   _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };
   _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };
   _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

/* 
  包装了一层   使得 _.map   _.filter等函数中可以直接使用,  巧妙之处在于  这些函数的 会在遍历函数iteratee中传了当前对象obj,而_.property闭包返回的函数恰好需要这个obj对象
  eg:  _.map(obj,_.property)  ===  _.pluck

*/
  _.property = function(key) {    
    return function(obj) {
      return obj[key];
    };
  };
   _.matches = function(attrs) {                           //判断 attrs中的键值对  在不在obj中   
    var pairs = _.pairs(attrs), length = pairs.length;    //  pairs的结构示例：  [[key1,value1],[key2,value2]]
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        //  如果 attrs[key]!==obj[key]或者 key不在obj中 返回false
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };
   _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };
   _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };
   _.now = Date.now || function() {
    return new Date().getTime();      // =>  +new Date()
  };
   var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);
   var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
     var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);
   _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };
   var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
   _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };
   var noMatch = /(.)^/;
   var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };
   _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);
     var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');
     var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
       return match;
    });
    source += "';\n";
     if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };
     var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };
   _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };
   var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };
   _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };
   _.mixin(_);
   _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });
   _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });
   _.prototype.value = function() {
    return this._wrapped;
  };
   if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));