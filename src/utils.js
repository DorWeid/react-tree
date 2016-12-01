export const DEFAULT_COLOR = "#61DAFB";
export const DIRTY_COLOR = "#FB0100";

const STARTING_HEIGHT = 100;
export const DECREASE_PER_LEVEL = 10;
const NODE_REF_NAME = 'node';

/**
 * Maps a node from the AVL tree to an array object
 * @param node
 * @param height
 */
const mapNodeToState = (node, height) => ({
  data: node.key,
  nodeKey: node.key,
  rightSon: node.rightChild,
  leftSon: node.leftChild,
  size: STARTING_HEIGHT - height * DECREASE_PER_LEVEL,
  ref: `${NODE_REF_NAME}${node.key}`,
  isDirty: false,
  height
});

/**
 * Return the AVL tree as an array in an in-order
 * @param node
 * @param height
 * @returns {Array}
 */
export const getNodesArray = (node , height = 1) => (
  !node ? [] :
    getNodesArray(node.leftChild, height + 1)
    .concat(mapNodeToState(node, height))
    .concat(getNodesArray(node.rightChild, height + 1))
);

export const flatten = arr => [].concat.apply([],arr);