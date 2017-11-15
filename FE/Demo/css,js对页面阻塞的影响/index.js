var express = require('express');
var app = express();
app.all('*', function (req, res, next) {
    var blockFileSuffix = [
            ".css", ".js"
        ],
        url = req.url,
        fileSuffix = url.match(/\.[^?]+/)
            ? url.match(/\.[^?]+/)[0]
            : "",
        sleepTime = url.match(/\?(\d+)/)
            ? url.match(/\?(\d+)/)[1]
            : 0;
    if (blockFileSuffix.indexOf(fileSuffix) != -1 && sleepTime) {
        setTimeout(() => {
            console.log(url + ' sleep :' + sleepTime);
            next();
        }, sleepTime)
    } else {
        next();
    }
});
app.use(express.static(__dirname + '/static')); //设置静态文件目录
app.listen(3000);