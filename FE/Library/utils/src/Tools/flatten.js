/**
 * flatten([2,3,[4,5,[6,[7]]]])
 * @param {需要压平处理的数组} arr 
 */
function flatten(arr) {
  return arr.reduce((a, b) => {
    return (a = a.concat(Array.isArray(b) ? flatten(b) : b));
  }, []);
}
export default flatten;
