import React  from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import Edge from '../Edge/Edge';
import Node from '../Node/Node';
import {AVLTree} from 'dsjslib';
import './App.css';
import {getNodesArray, flatten, DECREASE_PER_LEVEL} from './../utils';

export default class App extends React.Component {
  elAVL = new AVLTree((a,b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);
  board = {};

  constructor() {
    super();

    this.onDrag = this.onDrag.bind(this);
    this.addNode = this.addNode.bind(this);
    this.renderLevels = this.renderLevels.bind(this);
    this.findSons = this.findSons.bind(this);
    this.getEdgesFromNodes = this.getEdgesFromNodes.bind(this);
    this.reset = this.reset.bind(this);

    this.state = { linesArray:[],
                   nodesArray:[],
                   height: 0 };
  }

  /**
   * Callback function for node dragging
   * @param key
   */
  onDrag(key) {
    let draggedNode = this.state.nodesArray.find( node => node.nodeKey === key);

    draggedNode.isDirty = true;

    // TODO: improve performance
    const linesArray = this.getEdgesFromNodes(this.state.nodesArray);

    this.setState({ linesArray });
  }

  /**
   * Returns a single line between 2 nodes and given sizes
   * @param node1
   * @param node2
   * @param size
   * @param fromKey
   * @param toKey
   * @returns {*}
   */
  getLineBetweenNodes(node1, node2, size, fromKey, toKey) {
    const n1 = ReactDOM.findDOMNode(node1).getBoundingClientRect();
    const n2 = ReactDOM.findDOMNode(node2).getBoundingClientRect();

    return (!n1 || !n2) ? {} : {
      x1: n1.left - this.board.left + size / 2,
      x2: n2.left - this.board.left + ( size - DECREASE_PER_LEVEL ) / 2,
      y1: n1.top - this.board.top + size / 2,
      y2: n2.top - this.board.top + ( size - DECREASE_PER_LEVEL ) / 2,
      key: `${fromKey}-${toKey}`
    };
  }

  /**
   * Find node's children
   * @param node
   * @returns {[*,*]}
   */
  findSons(node) {
    return [
      node.rightSon ? this.refs[`node${node.rightSon.key}`] : null,
      node.leftSon ? this.refs[`node${node.leftSon.key}`] : null
    ];
  }

  /**
   * Get edges of AVL tree using its nodes
   * @param nodes
   * @returns {Array}
   */
  getEdgesFromNodes(nodes) {
    return flatten(nodes.map( node => {
      const sons = this.findSons(node);
      const currentNode = this.refs[node.ref];
      let keyDirection = 0;

      return sons.filter(son => son)
        .map(son => this.getLineBetweenNodes(currentNode, son, node.size, node.nodeKey, keyDirection++));
    }))
  }

  componentDidUpdate(props, state) {
    const linesArray = this.getEdgesFromNodes(this.state.nodesArray);

    if(state.linesArray.length !== linesArray.length) {
      this.setState({ linesArray });
    }
  }

  /**
   * Adds a node to the AVL tree and gets the new nodes array
   */
  addNode() {
    const inputData = this.refs.inputField.value;

    // Add a new node to tree
    this.elAVL.put(inputData, inputData);

    const nodesArray = getNodesArray(this.elAVL.root);

    // Set the new state of the nodes array
    this.setState({ nodesArray,
                    height: this.elAVL.root.height + 1}, );
  }

  /**
   * Resets the tree back to default render
   */
  reset() {
    const nodesArray = getNodesArray(this.elAVL.root);

    // Clear the reference to current array, and then set the state again
    this.setState({ nodesArray: [], height: 0 },
      () => this.setState({ nodesArray, height: this.elAVL.root.height + 1 }) );
  }

  componentDidMount() {
    this.board = ReactDOM.findDOMNode(this.refs.board).getBoundingClientRect();
  }

  /**
   * Renders the AVL tree
   * @returns {Array}
   */
  renderLevels() {
    return Array(this.state.height).fill().map((_, i) =>
      <div key={i+1} className="App-row">
        {this.renderNodes(i+1)}
      </div>
    );
  }

  // TODO: Rewrite this method for efficiency
  renderNodes(level) {
    let obj = {};
    let c = 0;

    // If required level is 1
    if(level === 1) {
      // TODO: Should this be at index[0] ?
      obj = this.state.nodesArray.find( node => node.height === 1);

      return <Node {...obj} key={obj.nodeKey} onDrag={this.onDrag} />;
    }

    const arr = [];

    // Get one level above the required level
    const filteredParentsArray = this.state.nodesArray.filter(node => node.height === level -1)
      .sort((a,b) => a.nodeKey - b.nodeKey);

    const filteredSonsArray = this.state.nodesArray.filter(node => node.height === level)
      .sort((a,b) => a.nodeKey - b.nodeKey);

    // This loop is based on the fact that the array should be sorter properly (in order iteration)
    for(let i=0;i<filteredParentsArray.length; i++) {
      // Check father's left son first
      if(filteredParentsArray[i].leftSon) {
        // Find the node according to key
        obj = filteredSonsArray.find( node => node.nodeKey === filteredParentsArray[i].leftSon.key);

        arr.push(<Node {...obj} key={obj.nodeKey} onDrag={this.onDrag} />);
      } else {
        arr.push(<div className="placeholder" key={`${level}-${c++}`} />)
      }

      // Then right son
      if(filteredParentsArray[i].rightSon) {
        obj = filteredSonsArray.find( node => node.nodeKey === filteredParentsArray[i].rightSon.key);

        arr.push(<Node {...obj} key={obj.nodeKey} onDrag={this.onDrag} />);
      } else {
        arr.push(<div className="placeholder" key={`${level}-${c++}`}/>)
      }
    }

    return arr;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="App-title">rekt</h2>
          <div className="App-insert">
            <input ref="inputField" placeholder="Add a node!" />
            <button onClick={this.addNode}>Add</button>
            <button onClick={this.reset}>Default</button>
          </div>
        </div>
        <div className="App-body">
          <div className="App-board" ref="board">
            <Edge linesArray={this.state.linesArray} />
            {this.renderLevels()}
          </div>
        </div>
      </div>
    );
  }
}