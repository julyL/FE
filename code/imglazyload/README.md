
### 原生js实现的图片懒加载  my-imglazyload.js (待完善)


| 属性值 | 说明  | 可选值 |   
| :---------|:------------| -----|
| container     | 需要懒加载图片的父级(DOM),当document中有多处需要懒加载的地方,用于限定范围 | 默认：document.body |
| imgAttribute  |  存放图片真实地址的属性        |   默认: data-original |
| distance|     距离视口多远时开始加载图片  |   默认: 0  出现在视口就开始加载  |
|ordinal |   是否按顺序加载图片　　　     |   默认: false   (可选true)  |
| placeholderImg|    图片还没加载时显示的占位图    |     |
| errorImg|     加载失败显示的图片   |     |
| loadingAction|   确定图片何时加载　　　    |  默认值: "defalut" 出现在视口就加载图片 　      　(可以设置数值,例如1000 表示必须满足"default"并且在停留在视口中1000ms,才开始加载图片   待实现 :( |
|showAnimation|      加载动画　　　　  |   默认: "fade"淡入效果   可以设置"none"来关闭  |

```
// 可以自己设置css来实现img的显示过渡动画  (设置css时先设置 showAnimation:"none" )

img[data-imglazy]{
     transition: all 1s;
}
img[data-imglazy='lazying'] {    
    opacity: 0;
}
img[data-imglazy='lazyed'] {
    opacity: 1;
}

```

注：上面出现的视口为 文档可见区域的大小  (distance会影响视口)

> lazy-img-load.js是别人写的,放在这里只是方便学习 :)