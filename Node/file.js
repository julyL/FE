var fs = require("fs");
var path = require("path");


function logSync(dir, callback) { //同步读取目录
    fs.readdirSync(dir).forEach(function(file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            logSync(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

// logSync(__dirname,(str)=>{
// 	console.log(str)
// });


function log(dir, callback) { //异步读取
    fs.readdir(dir, (error, files) => {
    	files.forEach((file)=>{
	        var pathname = path.join(dir, file);
	        fs.stat(pathname, (error, data) => {
	              console.log(data.isDirectory())
	        })		
    	})
    })
}

// log(__dirname, (str) => {
//     console.log(str)
// });


