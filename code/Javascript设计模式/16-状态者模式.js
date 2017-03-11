// not good
var Light = function() {
    this.state = 'off'; // 给电灯设置初始状态 off
    this.button = null; // 电灯开关按钮
};

Light.prototype.buttonWasPressed = function() {
    if (this.state === 'off') {
        console.log('弱光');
        this.state = 'weakLight';
    } else if (this.state === 'weakLight') {
        console.log('强光');
        this.state = 'strongLight';
    } else if (this.state === 'strongLight') {
        console.log('关灯');
        this.state = 'off';
    }
};

//good 


// OffLightState：
var OffLightState = function(light) {
    this.light = light;
};
OffLightState.prototype.buttonWasPressed = function() {
    console.log('弱光'); // offLightState 对应的行为
    this.light.setState(this.light.weakLightState); // 切换状态到 weakLightState
};
// WeakLightState：
var WeakLightState = function(light) {
    this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function() {
    console.log('强光'); // weakLightState 对应的行为
    this.light.setState(this.light.strongLightState); // 切换状态到 strongLightState
};
// StrongLightState：
var StrongLightState = function(light) {
    this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function() {
    console.log('关灯'); // strongLightState 对应的行为
    this.light.setState(this.light.offLightState); // 切换状态到 offLightState
};

var Light = function() {
    this.offLightState = new OffLightState(this);   //3个状态类，里面封装着各自的行为
    this.weakLightState = new WeakLightState(this);
    this.strongLightState = new StrongLightState(this);
    this.button = null;
};
// 状态模式:将状态封装成独立的类，并
// 将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化。
Light.prototype.init = function() {
    var button = document.createElement('button'),
        self = this;
    this.button = document.body.appendChild(button);
    this.button.innerHTML = '开关';
    this.currState = this.offLightState; // 设置当前状态
    this.button.onclick = function() {
        self.currState.buttonWasPressed();
    }
};
// Light状态的改变,会带来行为的改变。

Light.prototype.setState = function(newState) {
    this.currState = newState;
};

var light = new Light();
light.init();
