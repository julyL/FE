/*
http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651551875&idx=1&sn=070396f40f709aa13bcd1d5eabbb33ac&chksm=8025af42b7522654c6577675ca6ecd6f5cee54d5151a4ed74b69e0c3b53eddb8d80538641290&scene=0#rd
*/

function fn(n,range) {   // 返回 rang之间的n个整数  => fn(5,[2,32])
    var min = range[0],
        max = range[1],
        len = max - min + 1,
        initArr=[],
        returnArr = [num],    //返回的数组
        rangeArr=[];           //随机的数组
    var num = parseInt(n);
    for (var i = 0; i <= len; i++) {
        initArr[i] = min + i;
    }
    if (n == 0||isNaN(num)) {
      return;
    } else if (n == len ) {
      return initArr;
    }
    var half=len/2;
    if(num>half){
      rangeArr=getRange(len-num,[min,max]);
      return rangeArr.filter(function(val){
          return initArr.indexOf(val)==-1;
      });
    }else{
        return getRange(num,[min,max]);      
    }

}

function getRange(num, rang) {
    var min = rang[0],
        max = rang[1],
        len = rang[1] - rang[0];
    var rangarr = [],
        rangnum;
    for (var i = 0; i < num; i++) {
        rangnum = parseInt(Math.random() * (max - min) + min);
        while (rangarr.indexOf(rangnum) != -1) {
            rangnum = parseInt(Math.random() * (max - min) + min);
        }
        rangarr.push(rangnum);
    }
    return rangarr;
}
