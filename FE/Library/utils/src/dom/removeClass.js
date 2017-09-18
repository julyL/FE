import isElement from "../is/isElement.js";
function removeClass(el, className) {
  el = isElement(el) ? el : document.querySelector(el);
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(
      new RegExp("\\s*" + className + "\\s*"),
      ""
    );
  }
}
export default removeClass;
