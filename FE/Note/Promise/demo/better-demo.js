//例1:
   // bad:
   loadSomething().then(function(something) {
           loadAnotherthing().then(function(anthor) {
               DoSomethingOnThem(something, anthor);
           })
       })
   //fixed:  loadAnotherthing需要在loadSomething之后才能执行
   loadSomething().then(function(something) {
       return loadAnotherthing()
   }).then(function(anthor) {
       DoSomethingOnThem(something, anthor);
   })

//例2: promise链式调用
   var doSomethingAsync = function(val) {
       var time = +new Date() % 2 === 0 ? 100 : 200;
       return new Promise(function(re) {
           setTimeout(function() {
               console.log(val);
               re(val);
           }, time)
       })
   }

   //bad:
   function workMyCollection(arr) {
       function _recursive(idx) {
           if (idx >= arr.length) return resultArr;
           return doSomethingAsync(arr[idx]).then(function(res) {
               return _recursive(idx + 1);
           });
       }
       return _recursive(0);
   }
   //fixed1:
   function workMyCollection(arr) {
       var pro = doSomethingAsync(arr[0]);
       arr.slice(1).forEach(function(item) {
           pro = pro.then(function(res) {
               return doSomethingAsync(item);
           })
       })
   }
   //fixed2:
   function workMyCollection(arr) {
       arr.reduce(function(pro, val, index) {
           return pro.then(function(res) {
               return doSomethingAsync(val);
           })
       }, Promise.resolve())
   }

//例3
    //bad:  somethingElseAsync异常无法捕获
   somethingAync.then(function() {
           return somethingElseAsync();
       }, function(err) {
           handleMyError(err);
       })
    //good:
   somethingAsync()
       .then(function() {
           return somethingElseAsync();
       })
       .catch(function(err) {
           handleMyError(err);
       });
