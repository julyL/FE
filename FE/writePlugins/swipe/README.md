
## 移动端滑动组件 (未做兼容处理,仅供学习)
###使用
```
//引入swipe.js和swipe.css
css
     .demo1{
        width:100%;
        height:200px;
     }
     //只需要设置demo1的宽高就行，用于轮播的img默认继承父级的宽高

html结构
	<div class="demo1">
		<img src="" alt="">
		<img src="" alt="">
		<img src="" alt="">
	</div>
	
js
    var swipe1 = new Swipe({
        container: document.querySelector(".demo1"),
        child: document.querySelectorAll(".demo1 img")
    })

```


| 属性值 | 说明  | 默认值 | 类型  |
| :---------|:------------| -----|-----|
| container     |  滑动的父级容器| 必传 | DOM |
| child  |  父级容器内部的滑动元素    |   必传 | DOM |
| intervalTime|    定时滚动的时间间隔  |  5000   |  Number  |
| showIndicators|   是否显示Indicators  |  true   |   Boolean  |
| speed|   用于设置transitionDuration(滑动的时间)  |  500   |  Number |
| triggerDistance |   触发左右滑动的最小距离  |  40 |Number|

####实例方法
```
	getIndex   返回当前显示图片的Index ∈ [0,len-1]

```

访问示例:  
[https://julyl.github.io/Code/code/swipe/](https://julyl.github.io/Code/code/swipe/)  (切换到手机模式)
