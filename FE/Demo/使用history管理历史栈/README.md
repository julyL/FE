#### history管理历史栈
> 有如下需求：a -> b-> c -> d -> e  在e页面返回时,直接返回到b而不是d,再返回则到a

问题: 如何处理浏览器的回退事件?

浏览器没有回退事件,但我们可以通过popstate事件知道浏览器发生了(回退或者前进)
popstate事件会在历史记录发生了改变时触发,前提是调用了history.pushState()或history.replaceState()。
注意直接调用history.pushState()或history.replaceState()不会触发popstate事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮或者调用history.go、hisroty.back.

```js
// e页面的代码
(function () {
    window.onpopstate = function (event) {
        history.go(number);  // number=历史栈中a到e的步数
    };
    history.pushState(null, '', 'e.html');
})();
```
通过在e页面执行pushState(为了不改变url,pushState链接还是e.html),这样回退时会触发popstate事件。
在onpopstate回调中,我们可以通过执行history.go回退到b页面。history.go会移动历史栈中指向当前页面的指针。移动之后 a -> b(指向了这里) -> c -> d -> e,之后回退前进都是正确的。

问题:如何计算history.go的数值(e页面到b页面需要回退几步)?
直接用sessionStorage存储每个页面第一次进入时的history.length,然后2个页面之间存储的数值差2者在历史栈中的"距离"。
注意: 必须是第一次进入页面时的history.length,只有第一次进入时的history.length才是当前页面在历史栈中的问题, 如果页面已经添加到历史栈中了,那么这时访问历史栈中的所有页面得到的history.length都是一样的!!!

#### 参考 
http://blog.codingplayboy.com/2016/12/10/browser_history/
http://louiszhai.github.io/2017/02/24/back/#respond