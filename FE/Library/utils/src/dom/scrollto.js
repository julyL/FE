import "../polyfill/requestAnimationFrame.js";
/**
 * 
 * @param {需要滚动的元素} el 
 * @param {滚动到的位置} to 
 * @param {滚动时间} time 
 */
function scrollTo(el, to = 0, time = 300) {
  if (typeof el == "string") {
    el = document.querySelector(el);
  }
  var scrollTop = el.scrollTop,
    distance = scrollTop - to,
    move = distance / (time / 16.7);
  (function scroll() {
    var timer = requestAnimationFrame(function() {
      if (
        (distance > 0 && el.scrollTop - move <= to) ||
        (distance < 0 && el.scrollTop - move >= to)
      ) {
        el.scrollTop = to;
      } else {
        el.scrollTop -= move;
        scroll();
      }
      cancelAnimationFrame(timer);
      timer = null;
    });
  })();
}
export default scrollTo;
