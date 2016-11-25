export const DEFAULT_COLOR = "#61DAFB";
export const DIRTY_COLOR = "#fb0100";

const mapNodeToState = (node, height) => ([{
  data: node.key,
  nodeKey: node.key,
  rightSon: node.rightChild,
  leftSon: node.leftChild,
  size: 100 - height * 10,
  height: height,
  ref: `node${node.key}`,
  isDirty: false
}]);

export const getNodesArray = (node, height = 1) => {
  if(!node) return [];

  return getNodesArray(node.leftChild, height + 1)
    .concat(mapNodeToState(node, height))
    .concat(getNodesArray(node.rightChild, height + 1));
};

export const getLinesArray = (nodesArray) => {
  const arr = [];
  let key = 1;

  for(let i=0; i<nodesArray.length; i++) {
    for(let j=i; j<nodesArray.length; j++) {
      if(nodesArray[i].height === nodesArray[j].height - 1 &&
        ((nodesArray[i].rightSon && nodesArray[i].rightSon.key === nodesArray[j].nodeKey) ||
        (nodesArray[i].leftSon && nodesArray[i].leftSon.key === nodesArray[j].nodeKey ))) {
        arr.push({
          x1: nodesArray[i].x + 570,
          x2: nodesArray[j].x + 570,
          y1: nodesArray[i].y + 20,
          y2: nodesArray[j].y + 20,
          key: key++,
        });
      }
    }
  }

  return arr;
}
