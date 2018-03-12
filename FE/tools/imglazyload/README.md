
### 原生js实现的图片懒加载  my-imglazyload.js (持续完善中，欢迎反馈)



| 属性值 | 说明  | 可选值 |   
| :---------|:------------| -----|
| container     | 需要懒加载图片的父级(DOM),当document中有多处需要懒加载的地方,用于限定范围 | 默认：document.body |
| dataurl  |  存放图片真实地址的属性        |   默认: data-original |
| distance|     距离视口多远时开始加载图片  |   默认: 0  出现在视口就开始加载  |
|ordinal |   是否按顺序加载图片　　　     |   默认: false   (可选true)  |
| timeout|    按顺序加载图片时,图片加载的超时时间。如果图片加载超时,就会暂时跳过(先显示后续加载完的图片)  | 有点鸡肋(待实现)        |
| placeholderImg|    图片还没加载时显示的占位图    |     |
| errorImg|     加载失败显示的图片   |     |
| loadingAction|   确定图片何时加载　　　    |  默认值: "defalut" 出现在视口就加载图片 　      　(可以设置数值,例如1000 表示必须满足"default"并且在停留在视口中1000ms,才开始加载图片   待实现 :( |
|animation|      加载动画　　　　  |   默认: "fade"淡入效果   可以设置"none"来关闭  |

```
// 可以自己设置css来实现img的显示过渡动画  (需要先设置 animation:"none" ,否则css样式会冲突)

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
#### 效果演示

访问示例:  
[https://julyl.github.io/FE/tools/imglazyload](https://julyl.github.io/FE/tools/imglazyload)  (切换到手机模式)

[![]()](http://qr.liantu.com/api.php?text=https%3A%2F%2Fjulyl.github.io%2FFE%2Ftools%2Fimglazyload)


