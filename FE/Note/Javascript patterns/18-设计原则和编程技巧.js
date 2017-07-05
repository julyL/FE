//good
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();
var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage.setSrc(this.src);
    }
    return {
        setSrc: function(src) {
            myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
            img.src = src;
        }
    }
})();
proxyImage.setSrc('http:// imgcache.qq.com/music/photo/000GGDys0yA0Nk.jpg');





//bad
var createLoginLayer = (function() {
    var div;
    return function() {
        if (!div) {
            div = document.createElement('div');
            div.innerHTML = '我是登录浮窗';
            div.style.display = 'none';
            document.body.appendChild(div);
        }
        return div;
    }
})();

//good
var getSingle = function(fn) { // 获取单例
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    }
};
var createLoginLayer = function() { // 创建登录浮窗
    var div = document.createElement('div');
    div.innerHTML = '我是登录浮窗';
    document.body.appendChild(div);
    return div;
};
var createSingleLoginLayer = getSingle(createLoginLayer);
var loginLayer1 = createSingleLoginLayer();
var loginLayer2 = createSingleLoginLayer();
alert(loginLayer1 === loginLayer2); // 输出： true 




//bad
window.onload = function() {
    // 原有代码略
    console.log(document.getElementsByTagName('*').length);
};

//good
Function.prototype.after = function(afterfn) {
    var __self = this;
    return function() {
        var ret = __self.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};
window.onload = (window.onload || function() {}).after(function() {
    console.log(document.getElementsByTagName('*').length);
});



//bad
var makeSound = function(animal) {
    if (animal instanceof Duck) {
        console.log('嘎嘎嘎');
    } else if (animal instanceof Chicken) {
        console.log('咯咯咯');
    } else if (animal instanceof Dog) { // 增加跟狗叫声相关的代码
        console.log('汪汪汪');
    }
};
var Dog = function() {};
makeSound(new Dog()); // 增加一只狗

//good
var makeSound = function(animal) {
    animal.sound();
};
var Dog = function() {};
Dog.prototype.sound = function() {
    console.log('汪汪汪');
};





//bad
var del = function(obj) {
    var ret;
    if (!obj.isReadOnly) { // 不为只读的才能被删除
        if (obj.isFolder) { // 如果是文件夹
            ret = deleteFolder(obj);
        } else if (obj.isFile) { // 如果是文件
            ret = deleteFile(obj);
        }
    }
    return ret;
};

//good
var del = function(obj) {
    if (obj.isReadOnly) { // 反转 if 表达式
        return;
    }
    if (obj.isFolder) {
        return deleteFolder(obj);
    }
    if (obj.isFile) {
        return deleteFile(obj);
    }
};
