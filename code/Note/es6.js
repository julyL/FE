/*
	 参数默认值
*/
// bad    
function handleThings(opts) {
    opts = opts || {};
}

// good
function handleThings(opts = {}) {
    // ...
}

// 下面只有timeout有默认值  注意:只有timeout===undefined时，才使用默认值
function makeRequest(url, timeout = 2000, callback) {
    // 函数的剩余部分
    console.log(timeout)
}
makeRequest("/foo", undefined, function(body) { // => 2000

});

makeRequest("/foo", null, function(body) { // => null

});




/*
	 解构赋值
*/


 // 设置解构默认值
let node = {
        type: "Identifier",
        name: "foo"
    };

let { type, name, value=true } = node;   

console.log(type);      // "Identifier"
console.log(name);      // "foo"
console.log(value);     // true
/*
变量 value 被指定了一个默认值 true ，只有在 node 的对应属性缺失、或对应的属性值为 undefined 的情况下，该默认值才会被使用。由于此处不存在 node.value 属性，变量 value 就使用了该默认值。这种工作方式很像函数参数的默认值
 */


//  bad
function getFullName(user) {
    const firstName = user.firstName;
    const lastName = user.lastName;
}

// good
function getFullName(obj) {
    const { firstName, lastName } = obj;
}

// best   //参数解构
function getFullName({ firstName, lastName }) {};     //如果没有传参会报错
function getFullName({ firstName, lastName }={}) {};



//  赋值给不同的本地变量名
let node = {
        type: "Identifier",
        name: "foo"
    };
let { type: localType, name: localName="bar" } = node;   //bar为默认值
console.log(localType);     // "Identifier"
console.log(localName);     // "foo"

// 交换值
let a = 1,
    b = 2;

[ a, b ] = [ b, a ];

console.log(a);     // 2
console.log(b);     // 1


//  剩余项
let colors = [ "red", "green", "blue" ];
let [ firstColor, ...restColors ] = colors;   
//剩余项必须是数组解构模式中最后的部分，之后不能再有逗号，否则就是语法错误
console.log(firstColor);        // "red"
console.log(restColors.length); // 2
console.log(restColors[0]);     // "green"
console.log(restColors[1]);     // "blue"


// 在 ES6 中克隆数组
let colors = [ "red", "green", "blue" ];
let [ ...clonedColors ] = colors;



/*
	剩余参数  ...args
	剩余参数(rest parameter)由三个点(...)与一个紧跟着的具名参数指定，它会是包含传递给函数的其余参数的一个数组，名称中的"剩余"也由此而来
	函数只能有一个剩余参数，并且它必须被放在最后
*/
// bad
function concatenateAll() {
    const args = Array.prototype.slice.call(arguments);
    return args.join('');
}

// good
function concatenateAll(...args) {
    return args.join('');
}

/*	
扩展运算符(和剩余参数类似)  剩余参数允许你把多个独立的参数合并到一个数组中；而扩展运算符则允许将一个数组分割，并将各个项作为分离的参数传给函数。
 */
//bad
let values = [25, 50, 75, 100]
console.log(Math.max.apply(Math, values)); // 100

//good
let values = [25, 50, 75, 100]
    // 等价于 console.log(Math.max(25, 50, 75, 100));
console.log(Math.max(...values)); // 100

//你可以将扩展运算符与其他参数混用
let values = [-25, -50, -75, -100]
console.log(Math.max(...values, 0)); // 0



/*
	字符串
*/
// bad
const a = "foobar";
const b = 'foo' + a + 'bar';

// good
const a = 'foobar';
const b = `foo${a}bar`;


/*
	箭头函数

	匿名自执行函数:
	使用传统函数时， (function(){})(); 与 (function(){}()); 这两种方式都是可行的。
	但若使用箭头函数，则只有下面的写法是有效的： (() => {})();	
 */

// good
[1, 2, 3].map((x) => {
    return x * x;
});

// best
[1, 2, 3].map(x => x * x);
