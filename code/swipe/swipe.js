(function(global, factory) {
    typeof exports === 'object' && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Swipe = factory());
}(this, function() {
    var Swipe = function(config) {
        this.container = config.container;
        this.scrollpart = config.scrollpart;
        this.toggletime = config.toggletime;

        var con = this.container;

        con.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchx = e.touches[0].clientX;
        }, false);



    }
    return Swipe;
}));


// var ul = document.getElementById('ul');
// var touchx = 0;
// var index = 0;
// var lilen = ul.getElementsByTagName('li').length;
// var liwidth = document.documentElement.clientWidth;

// ul.addEventListener('touchstart', function(e) {
//     e.preventDefault();
//     touchx = e.touches[0].clientX;
//     console.log(touchx);
// }, false);
// ul.addEventListener('touchmove', function(e) {
//     var offsetX = e.changedTouches[0].pageX;
//     if (offsetX > touchx) {
//         ul.style.transform = 'translate3d(' + (offsetX - touchx) + 'px,0,0)';
//     } else if (offsetX < touchx) {
//         console.log(1)
//         ul.style.transform = 'translate3d(' + -(touchx - offsetX) + 'px,0,0)';
//     }
// }, false);
// ul.addEventListener('touchend', function(e) {
//     var endtouch = e.changedTouches[0].pageX;

//     if (endtouch + 20 < touchx) {
//         if (index >= lilen - 1) {
//             ul.style.transform = 'translate3d(' + -(index * liwidth) + 'px,0,0)';
//         } else {
//             index++;
//             ul.style.transform = 'translate3d(' + -(index * liwidth) + 'px,0,0)';
//         }
//     } else if (endtouch - 20 > touchx) {
//         if (index <= 0) {
//             ul.style.transform = 'translate3d(0,0,0)';
//         } else {
//             index--;
//             ul.style.transform = 'translate3d(' + -(index * liwidth) + 'px,0,0)';
//         }
//     } else {
//         ul.style.transform = 'translate3d(' + -(index * liwidth) + 'px,0,0)';
//     }
// }, false);
