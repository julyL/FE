/**
 * 
 * @param {需要处理的字符串} str 
 * @param {是否去掉多余的空格(有多个空格时,只保留一个空格)} replaceall 
 */
function trim(str, replaceall) {
  if (replaceall) {
    return str.replace(/^\s*|\s*$/g, "").replace(/\s+/, " ");
  } else {
    return str.replace(/^\s*|\s*$/g, "");
  }
}
export default trim;
