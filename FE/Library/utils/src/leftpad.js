// 技巧:  快速补全 Array(3).join("0") => "00"

/**
 * 原版的left-pad模块
 * @param {需要补全的字符串} str
 * @param {补全后的长度} len
 * @param {用于补全的字符} ch
 * leftpad("6",2,0) = > "06"
 */
function leftpad(str, len, ch) {
  str = String(str);

  var i = -1;

  if (!ch && ch !== 0) ch = " ";

  len = len - str.length;

  while (++i < len) {
    str = ch + str;
  }

  return str;
}

export default leftpad;
