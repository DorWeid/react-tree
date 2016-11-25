import React  from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import Edge from '../Edge/Edge';
import Node from '../Node/Node';
import {AVLTree} from 'dsjslib';
import './App.css';
import {getNodesArray, getLinesArray} from './../utils';

export default class App extends React.Component {
  elBST = new AVLTree((a,b) => parseInt(a) > parseInt(b) ? -1 : 1);
  board = {};

  constructor() {
    super();

    this.onDrag = this.onDrag.bind(this);
    this.addNode = this.addNode.bind(this);
    this.renderLevels = this.renderLevels.bind(this);
    this.getPositions = this.getPositions.bind(this);
    this.reset = this.reset.bind(this);

    this.state = { linesArray:[],
                   nodesArray:[],
                   height: 0 };
  }

  onDrag(e, data, key) {
    let obj = this.state.nodesArray.find( node => node.nodeKey === key);

    obj.isDirty = true;

    // TODO: improve performance
    const linesArray = this.getPositions(this.state.nodesArray);

    this.setState({
      linesArray
    })
  }

  // Returns a single line between 2 nodes and given sizes
  getLineBetweenNodes(node1, node2, size1, size2) {
    const n1 = ReactDOM.findDOMNode(node1).getBoundingClientRect();
    const n2 = ReactDOM.findDOMNode(node2).getBoundingClientRect();

    return {
      x1: n1.left - this.board.left + size1 / 2,
      x2: n2.left - this.board.left + size2 / 2,
      y1: n1.top - this.board.top + size1 / 2,
      y2: n2.top - this.board.top + size2 / 2,
    };
  }

  getPositions(nodes) {
    const positions = [];
    let currentRef, sonRef;

    for(let i=0;i<nodes.length;i++) {
      currentRef = this.refs[nodes[i].ref];
      if(nodes[i].rightSon) {
        sonRef = this.refs[`node${nodes[i].rightSon.key}`];

        positions.push(this.getLineBetweenNodes(currentRef, sonRef, nodes[i].size, nodes[i].size - 10));
      }

      if(nodes[i].leftSon) {
        sonRef = this.refs[`node${nodes[i].leftSon.key}`];

        positions.push(this.getLineBetweenNodes(currentRef, sonRef, nodes[i].size, nodes[i].size - 10));
      }
    }

    return positions;
  }

  componentDidUpdate(props,state) {
    const linesArray = this.getPositions(this.state.nodesArray);

    if(state.linesArray.length != linesArray.length) {
      this.setState({ linesArray });
    }
  }

  addNode() {
    const inputData = this.refs.inputField.value;

    // Add a new node to tree
    this.elBST.put(inputData, inputData);

    const nodesArray = getNodesArray(this.elBST.root);

    // Set the new state of the nodes array
    this.setState({ nodesArray,
                    height: this.elBST.root.height + 1}, );
  }

  reset() {
    const nodesArray = getNodesArray(this.elBST.root);

    // Clear the reference to current array, and then set the state again
    this.setState({ nodesArray : [],
                    height: 0 },
      () => this.setState({ nodesArray, height: this.elBST.root.height + 1 }) );

    // this.forceUpdate();

    // this.setState({ nodesArray,
    //                 height: this.elBST.root.height + 1}, );
  }

  componentDidMount() {
    this.board = ReactDOM.findDOMNode(this.refs.board).getBoundingClientRect();
  }

  renderLevels() {
    const lines = [];

    // Render rows
    for(let i=1;i<=this.state.height; i++) {
      lines.push(
        <div key={i} className="test1">
          {
            this.renderNodes(i)
          }
        </div>
      )
    }

    return lines;
  }

  renderNodes(level) {
    let obj = {};

    // If required level is 1
    if(level === 1) {
      // TODO: Should this be at index[0] ?
      obj = this.state.nodesArray.find( node => node.height === 1);

      return [<Node {...obj} key={obj.nodeKey} onDrag={this.onDrag} />];
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
        arr.push(<div className="placeholder"></div>)
      }

      // Then right son
      if(filteredParentsArray[i].rightSon) {
        obj = filteredSonsArray.find( node => node.nodeKey === filteredParentsArray[i].rightSon.key);

        arr.push(<Node {...obj} key={obj.nodeKey} onDrag={this.onDrag} />);
      } else {
        arr.push(<div className="placeholder"></div>)
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

// {this.state.nodesArray.map(node => <Node ref={`node${node.nodeKey}`} onDrag={this.onDrag} key={node.nodeKey} {...node}/>)}
{/*<Edge linesArray={this.state.linesArray} />*/}
