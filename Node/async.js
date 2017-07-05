//同步处理
var len = arr.length,
    i = 0;

for (; i < len; ++i) {
    arr[i] = sync(arr[i]);
}

//异步处理(串行处理)
(function next(i, len, callback) {
    if (i < len) {
        async(arr[i], function(value) {
            arr[i] = value;
            next(i + 1, len, callback);
        });
    } else {
        callback();
    }
}(0, arr.length, function() {
    // All array items have processed.
}));

//并行处理
(function(i, len, count, callback) {
    for (; i < len; ++i) {
        (function(i) {
            async(arr[i], function(value) {
                arr[i] = value;
                if (++count === len) {
                    callback();
                }
            });
        }(i));
    }
}(0, arr.length, 0, function() {
    // All array items have processed.
}));




//(深度优先+先序遍历)   同步遍历
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function(file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

// 异步遍历 (串行处理)
function travel(dir, callback, finish) {
    fs.readdir(dir, function(err, files) {
        (function next(i) {
            if (i < files.length) {
                var pathname = path.join(dir, files[i]);
                fs.stat(pathname, function(err, stats) {
                    if (stats.isDirectory()) {
                        travel(pathname, callback, function() {
                            next(i + 1);
                        });
                    } else {
                        callback(pathname, function() {
                            next(i + 1);
                        });
                    }
                });
            } else {
                finish && finish();
            }
        }(0));
    });
}


function travel(dir, callback, finish) {
    fs.readdir(dir, function(err, files) {
        var queue = {};
        var pathname = path.join(dir, files[i]);
        (function(i) {
            fs.stat(pathname, function(err, stats) {
                if (stats.isDirectory()) {

                } else {
                    

                }
            });
        })(i);
    });
}
