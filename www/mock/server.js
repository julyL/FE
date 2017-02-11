var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();

app.use(bodyParser.json({ limit: '1mb' })); //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post("/post", function(req, res) {
        fs.readFile('./json/city.json', 'utf8', function(err, data) {    
            res.send(JSON.parse(data));
        });
});
app.get("/city", function(req, res) {   // 选择房间
        fs.readFile('./json/city.json', 'utf8', function(err, data) {    
            res.send(JSON.parse(data));
        });
});



app.listen(4004);
console.log('localhost:4004...');
