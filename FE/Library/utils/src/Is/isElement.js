function isElement(node) {
  if (!node || node.nodeType !== 1) {
    return false;
  }
  return true;
}
export default isElement;
