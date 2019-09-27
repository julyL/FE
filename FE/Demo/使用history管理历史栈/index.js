window.onload = function () {
    var body = document.body,
        h4 = document.createElement("h4");

    h4.innerHTML = "referrer:  " + document.referrer + "</br> history.length:  " + history.length;
    body.appendChild(h4);

}
var Store = {};
Store.set = function (key, val) {
    sessionStorage.setItem(key, JSON.stringify(val));
}
Store.get = function (key) {
    return sessionStorage[key] ? JSON.parse(sessionStorage[key]) : "";
}