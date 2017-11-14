function addCssRule(selector, rule) {
  var style = document.createElement("style");
  style.type = "text/css";
  document.head.appendChild(style);
  style.sheet.insertRule(selector + "{" + rule + "}", 0);
}
export default addCssRule;
