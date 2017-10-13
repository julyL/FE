/**
 * 使用场景:
 * 页面中有一个fixed定位的可滚动的浮层,如果浮层滚动到顶部时,手指继续向下滑动,这时浮层已经无法继续向上滚动了，正常情况是这样的...
 * 但是IOS会出现浮层的下面会发生滚动的奇葩现象。
 * 解决办法: 滚动到顶部时，使浮层保留1px的scrollTop :)
 * @param {String or Element} elem 
 */
function ScrollFix(elem) {
  var startY, startTopScroll;
  elem = typeof elem == "string" ? document.querySelector(elem) : elem;
  if (!elem) return;
  elem.addEventListener(
    "touchstart",
    function(event) {
      startY = event.touches[0].pageY;
      startTopScroll = elem.scrollTop;

      if (startTopScroll <= 0) {
        elem.scrollTop = 1;
      }
      if (startTopScroll + elem.offsetHeight >= elem.scrollHeight) {
        elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
      }
    },
    false
  );
}
export default ScrollFix;
