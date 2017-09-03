
/*
    阶乘的递归
    一般的递归函数 由于函数调用时需要保存上一个函数的变量等(js闭包的原理),当数据量大时，可能会导致栈溢出。一般编译器会实现尾递归优化,即是尾递归时会释放上一个函数的保存的变量。

    尾递归: 函数直接返回下一个递归函数
    
    fact需要 fact(n-1)返回之后再 *n 才能返回,不是尾递归
    facttail为尾递归的实现 (尾递归一般都可以直接转化为循环)
*/
function fact(n){
    if(n<0){
        return 0;
    }else if(n<=1){
        return 1;
    }else{
        return n*fact(n-1);
    }
}

function facttail(n,a){
    if(n<0){
        return 0;
    }else if(n==0){
        return 1;
    }else if(n==1){
        return a;
    }else{
        return facttail(n-1,n*a);
    }
}
fact===facttail(n,1);


// 斐波拉契数列   1 1 2 3 5 8 13
function fib(n){
    return n<2?1:fib(n-1)+fib(n-2);
}

function fibtail(n,a,b){
    if(n==0){
        return a;
    }else{
        return fibtail(n-1,b,a+1);
    }
}
fib(n)===fibtail(n,0,1);
