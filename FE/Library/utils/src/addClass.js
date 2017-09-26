import isElement from "./isElement.js";
import hasClass from "./hasClass.js";
function addClass(el, className) {
  el = isElement(el) ? el : document.querySelector(el);
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!hasClass(el, className)) {
      el.className += " " + className;
    }
  }
}
export default addClass;
