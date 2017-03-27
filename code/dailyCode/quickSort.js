//  http://blog.csdn.net/morewindows/article/details/6684558
function quickSort(arr, left, right) {
    if (left >= right) {
        return;
    }
    var left = left || 0;
    var right = right || arr.length - 1;
    var index = left; //基准点
    var start = left,
        end = right;
    while (left < right) {
        for (var i = right; i > index; i--) {
            right--;
            if (arr[i] < arr[index]) {
                swap(i, index, arr);
                index = i;
                break;
            }
        }
        for (var i = left+1; i < index; i++) {
            left++;
            if (arr[i] > arr[index]) {
                swap(i, index, arr);
                index = i;
                break;
            }
        }
    }
    quickSort(arr, start, index - 1)
    quickSort(arr, index + 1, end)
    return arr;

    function swap(i, j, arr) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

function random(max,len){
  var arr=[];
  for(var i=0;i<len;i++){
    arr.push(parseInt(Math.random()*(max+1)));
  }
  return arr;
}
function sort(arr){
  return arr.sort(function(a,b){return a-b});
}
// quickSort(random(1000,30))
for(var j=0;j<100;j++){
  var arr=random(100,20),
    copyArr=arr.concat();
   var a=quickSort(arr);
       b=sort(copyArr);
    if(a.join()!=b.join()){
        console.log("测试不通过,测试数据：",a,b)
        break;
    }
}
// [2, 2, 6, 2, 7]