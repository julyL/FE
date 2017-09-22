/**
 * 简单的数组去重  (未对NaN进行处理)
 * @param {去重的数组} arr 
 */
function unique(arr) {
  return arr.filter((v, i) => arr.indexOf(v) === i);
}
export default unique;
