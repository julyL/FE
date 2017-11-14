var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();
var router = express.Router();

app.use(bodyParser.json({ limit: '1mb' })); //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

app.all('*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.get('/get', function(req, res, next) { // get
    res.send({
        testType: "get"
    });
});

app.get('/getdata', function(req, res, next) { // get携带参数
    res.send({
        testType: "getdata"
    });
});

app.post('/post', function(req, res, next) { // post
    res.send({
        testType: "post"
    });
});

app.post('/postdata', function(req, res, next) { // post携带参数  
    res.send({
        testType: "postdata"
    });
});


app.get('/jsonp', function(req, res, next) { // 返回jsonp 
    setTimeout(function() {
        res.type('application/json');
        res.jsonp({
            testType: "jsonp"
        });
    }, 2000)
});


app.listen(4004);
console.log('服务已启动,访问localhost:4004');


// supervisor server.js
