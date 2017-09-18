import trim from "../Tools/trim.js";
function hasClass(el, className) {
  var classNameArrays = trim(el.className, true).split(" ");
  return classNameArrays.indexOf(className) != -1 ? true : false;
}
export default hasClass;
