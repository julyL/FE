/**
 *
 * @param {处理的字符串} str
 * @param {用于补全的字符} ch
 * @param {补全的长度} len
 * leftpad(6,0) => "06"
 */

function leftpad(str, ch = "0", len = 1) {
    str = String(str);
    return Array(len + 1).join(ch) + str;
}
export default leftpad;
