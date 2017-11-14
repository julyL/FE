/**
 * 使用场景:
 * 用于解决ios手机下滑动露底的问题
 * 手指在el上滑动时,当滑动到最顶部(或者最顶部)时,继续向上(或者向下)滑动,则阻止浏览器的默认行为
 * @param {String or Element} el 
 */
function fixIosScroll(el) {
  var content = typeof el == "string" ? document.querySelector(el) : el;
  var startY;
  content.addEventListener("touchstart", function(e) {
    startY = e.touches[0].clientY;
  });
  content.addEventListener("touchmove", function(e) {
    // 高位表示向上滚动
    // 底位表示向下滚动
    // 1容许 0禁止
    var status = "11";
    var ele = this;
    var currentY = e.touches[0].clientY;
    if (ele.scrollTop === 0) {
      // 如果内容小于容器则同时禁止上下滚动
      status = ele.offsetHeight >= ele.scrollHeight ? "00" : "01";
    } else if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
      // 已经滚到底部了只能向上滚动
      status = "10";
    }

    if (status != "11") {
      // 判断当前的滚动方向
      var direction = currentY - startY > 0 ? "10" : "01";
      // 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
      if (!(parseInt(status, 2) & parseInt(direction, 2))) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }
  });
}
export default stopScrollOver;
