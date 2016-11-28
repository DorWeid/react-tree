export const DEFAULT_COLOR = "#61DAFB";
export const DIRTY_COLOR = "#FB0100";

const STARTING_HEIGHT = 100;
const DECREASE_PER_LEVEL = 10;
const NODE_REF_NAME = 'node';
const X_OFFSET = 570;
const Y_OFFSET = 20;

const mapNodeToState = (node, height) => ([{
  data: node.key,
  nodeKey: node.key,
  rightSon: node.rightChild,
  leftSon: node.leftChild,
  size: STARTING_HEIGHT - height * DECREASE_PER_LEVEL,
  height: height,
  ref: `${NODE_REF_NAME}${node.key}`,
  isDirty: false
}]);

/**
 * Return the AVL tree as an array in an in-order
 * @param node
 * @param height
 * @returns {Array}
 */
export const getNodesArray = (node , height = 1) => {
  if(!node) return [];

  return getNodesArray(node.leftChild, height + 1)
    .concat(mapNodeToState(node, height))
    .concat(getNodesArray(node.rightChild, height + 1));
};

/**
 * Create the edges array using vertexes(nodes) array
 * @param nodesArray
 * @returns {Array}
 */
export const getLinesArray = (nodesArray = []) => {
  const arr = [];
  let key = 1;

  for(let i=0; i<nodesArray.length; i++) {
    for(let j=i; j<nodesArray.length; j++) {
      if(nodesArray[i].height === nodesArray[j].height - 1 &&
        ((nodesArray[i].rightSon && nodesArray[i].rightSon.key === nodesArray[j].nodeKey) ||
        (nodesArray[i].leftSon && nodesArray[i].leftSon.key === nodesArray[j].nodeKey ))) {
        arr.push({
          x1: nodesArray[i].x + X_OFFSET,
          x2: nodesArray[j].x + X_OFFSET,
          y1: nodesArray[i].y + Y_OFFSET,
          y2: nodesArray[j].y + Y_OFFSET,
          key: key++,
        });
      }
    }
  }

  return arr;
}
