//  http://blog.csdn.net/morewindows/article/details/6684558
function quickSort(arr, left, right) {
    if (left >= right) {
        return;
    }
    var left = left !== undefined ? left : 0;
    var right = right !== undefined ? right : arr.length - 1;
    var index = left; //基准点
    var start = left,
        end = right;
    while (left < right) {
        for (var i = right; i > index; i--) {
            if (arr[i] < arr[index]) {
                swap(i, index, arr);
                index = i;
                left++;
                break;
            }
            right--;
        }
        for (var i = left; i < index; i++) {
            if (arr[i] > arr[index]) {
                swap(i, index, arr);
                right--;
                index = i;
                break;
            }
            left++;
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

// 简洁版
function quickSort1(arr, l, r) {
    var l = l !== undefined ? l : 0,
        r = r !== undefined ? r : arr.length - 1;
    var left = l,
        right = r,
        x = left;
    if (left >= right) {
        return;
    }
    temp = arr[x];
    while (l < r) {
        while (arr[r] >= temp && r > l) {
            r--;
        }
        if (r > l) {
            arr[x] = arr[r]; // 改为   arr[l++]=arr[r]
            x = r;
            l++;
        }
        while (arr[l] <= temp && r > l) {
            l++;
        }
        if (r > l) {
            arr[x] = arr[l]; //  arr[r--]=arr[l];
            x = l;
            r--;
        }
    }
    arr[x] = temp;
    quickSort1(arr, left, x - 1);
    quickSort1(arr, x + 1, right);
    return arr;
}

//快速排序  
/*
void quick_sort(int s[], int l, int r)  
{  
    if (l < r)  
    {  
        //Swap(s[l], s[(l + r) / 2]); //将中间的这个数和第一个数交换 参见注1  
        int i = l, j = r, x = s[l];  
        while (i < j)  
        {  
            while(i < j && s[j] >= x) // 从右向左找第一个小于x的数  
                j--;    
            if(i < j)            //  当 i==j 截止终止
                s[i++] = s[j];  
              
            while(i < j && s[i] < x) // 从左向右找第一个大于等于x的数  
                i++;    
            if(i < j)   
                s[j--] = s[i];  
        }  
        s[i] = x;  
        quick_sort(s, l, i - 1); // 递归调用   
        quick_sort(s, i + 1, r);  
    }  
} 
 */



//  生成测试数组
function random(max, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(parseInt(Math.random() * (max + 1)));
    }
    return arr;
}

// sort排序
function sort(arr) {
    return arr.sort(function(a, b) {
        return a - b
    });
}

//测试代码
for (var j = 0; j < 1000; j++) {
    var arr = random(1000, 50),
        copyArr = arr.concat(),
        copyArr2 = arr.concat();
    console.log(arr)
    var a = quickSort(arr),
        b = sort(copyArr);
    if (a.join() != b.join()) {
        console.log("测试不通过:", copyArr2)
        break;
    }
}
if (j == 1000) {
    console.log("测试通过")
}
