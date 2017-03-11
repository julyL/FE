// 下面是 面向对象语言的写法 
//  (由于参数不能是函数,所以需要封装成Command对象,然后调用Command对象的execute方法)

var MenuBar = {
    refresh: function() {
        console.log('刷新菜单目录');
    }
};
var RefreshMenuBarCommand = function(receiver) {
    this.receiver = receiver;
};
RefreshMenuBarCommand.prototype.execute = function() {
    this.receiver.refresh();
};
var setCommand = function(button, command) {
    button.onclick = function() {
        command.execute();
    }
};
var refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);
// 统一都通过setCommand设置'命令',命令的具体执行过程被封装在各个不同command的execute方法中


//	js中函数可以当做参数，直接将callback传入(setCommand参数)
var MenuBar = {
    refresh: function() {
        console.log('刷新菜单目录');
    }
};
var RefreshMenuBarCommand = function(receiver) {
    return {
        execute: function() {
            receiver.refresh();
        }
    }
};
var setCommand = function(button, command) {
    button.onclick = function() {
        command.execute();
    }
};
var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);
