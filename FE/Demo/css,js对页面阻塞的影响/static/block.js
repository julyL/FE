var div = document.querySelector("div");
var body = document.body;
var h5 = document.createElement("h5");
var con = "block.js :" + (div
    ? "能获取到div"
    : "不能获取到div");
h5.innerHTML = con;
console.log(con);
body.appendChild(h5);
