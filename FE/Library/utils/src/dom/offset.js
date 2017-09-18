function offset(el) {
  var obj = el.getBoundingClientRect();
  return {
    left: obj.left + window.pageXOffset,
    top: obj.top + window.pageYOffset,
    width: obj.width,
    height: obj.height
  };
}
export default offset;
