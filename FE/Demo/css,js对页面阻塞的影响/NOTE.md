#### 聊聊浏览器的渲染机制

`以下结论均在Chrome测试得出`
[demo地址](https://github.com/julyL/FE/tree/master/FE/Demo/css%2Cjs%E5%AF%B9%E9%A1%B5%E9%9D%A2%E9%98%BB%E5%A1%9E%E7%9A%84%E5%BD%B1%E5%93%8D)
```
1. css不阻塞dom的解析,但会阻塞页面渲染  
// demo1中 block.js会先打印(说明没有阻塞解析),随后2秒后页面才显示。

2. js会阻塞dom的解析,并不阻塞页面的渲染。页面的渲染并不需要在dom完全解析之后。
// demo2页面会先显示出来,说明并没有阻塞渲染。
但是我们设置了定时器去检测页面中div的数量,发现之后block.js?5000执行完成之后才能检测到后续的div,说明js阻塞后续dom的解析

3. 加载css会阻塞外链js的执行
// demo3  block.js很快就加载了,但是5秒之后才会执行

4. 添加defer的js不会阻塞页面的渲染
//  demo4 有没有加defer的区别在于是否会阻塞js之前dom的渲染。有defer不会阻塞js位置之前dom的渲染

注: 
dom解析之后才可以通过js获取到dom
dom渲染是将其显示在页面上的过程
页面中的js并不是解析到script标签才开始的下载的,js的下载是并行的。
```

