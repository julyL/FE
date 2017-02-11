export default function(title) {
    document.title = title;
    if(/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())){
        var i = document.createElement('iframe');
        i.src = '//m.baidu.com/favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function() {
                i.remove();
            }, 0)
        }
        document.body.appendChild(i);   
    }
}
