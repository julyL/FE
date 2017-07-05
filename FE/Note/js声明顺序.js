function aa(a,b,c){
    console.log(a);
    console.log(aa);
    console.log(arguments);
    var a="ee";
    var aa="444";
    arguments=6;   
    console.log(a);
    console.log(aa);
    console.log(arguments);
    function a(){}
}
aa(1,2,3)

/*
执行过程:
    提前的操作：
        a=1,b=2,c=3;        //   传参赋值
        function a(){};     //   函数声明提前
        var a,aa;           //   变量声明提前
    正常执行：
        function a(){};
        console.log(a);             // fn
        console.log(aa);            // undefined
        console.log(arguments);     //  [fn,2,3]
        a="ee"
        aa="444"
        arguments=6;  
        console.log(a);             // ee
        console.log(aa);            // 444
        console.log(arguments);     // 6

结论:  
函数的执行顺序:  传参赋值 -> 变量和函数声明提前  ->  正常从上到下执行
优先级顺序 赋值操作 > 函数声明 > 传参赋值 >  变量声明
 */

//注意:  全局变量是不会声明提前的
var num1 = 1;    
function fn(num3){  
    console.log(num1);      //   undefined   
    console.log(num3);      //   4  
    console.log(num4);      //   throw error  "num4 is not defined"
    console.log(num2);      //   throw error  "num2 is not defined"  
    var num1 = num4 = 2;   
    num2 = 3;  
    var num3= 5;  
}   
fn(4);