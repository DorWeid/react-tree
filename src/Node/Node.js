// /**
//  * Created by Dor on 11/11/2016.
//  */
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import MtSvgLines from 'react-mt-svg-lines';
import { paths } from './drawing';
import {DEFAULT_COLOR, DIRTY_COLOR} from './../utils';
import './Node.css';

export default class Node extends React.Component {

  constructor() {
    super();

    this.getTransforms = this.getTransforms.bind(this);
  }

  animate(handle) {
    handle();

    requestAnimationFrame(() => { this.animate(handle) });
  }

  tweenLoop() {
    this.current = this.current || 0;
    this.pathTotalLength = this.getPathTotalLength();

    if (this.current >= this.pathTotalLength) {
      this.current = 0;
    }

    this.current += this.pathTotalLength / 200;

    this.setState({
      length: this.current
    });
  }

  getPathTotalLength() {
    return this.pathTotalLength || ReactDOM.findDOMNode(this.refs.path1).getTotalLength();
  }

  getTransforms() {
    if (!this.refs.path1) {
      return [];
    }

    return Object.keys(paths).map(ref => {
      let pos = this[ref].getPointAtLength(this.state.length);
      return `translate(${pos.x}px, ${pos.y}px)`;
    });
  }

  componentDidMount() {
    // this.shouldAnimate = this.animate(()=> {this.tweenLoop()});

    // Object.keys(paths).map(ref => {
    //   this[ref] = ReactDOM.findDOMNode(this.refs[ref]);
    // });
  }


  render() {
    const {nodeKey, data, onDrag, size, isDirty, transform} = this.props;
    // const transforms = this.getTransforms();

    const strokeColor = isDirty ? DIRTY_COLOR : DEFAULT_COLOR;
    console.log(transform)
    return (
      <Draggable onDrag={(e,data) => onDrag(nodeKey)}>
        <div className="Node">
          <MtSvgLines animate duration={1000}>
            <svg width={size} height={size} viewBox="45 45 300 300"  className="Node-text">
              <path ref="path1" stroke={strokeColor} strokeWidth="4" fill="none" d={paths.path1.d}/>
              <path ref="path2" stroke={strokeColor} strokeWidth="4" fill="none" d={paths.path2.d}/>
              <path ref="path3" stroke={strokeColor} strokeWidth="4" fill="none" d={paths.path3.d}/>
              <circle fill={strokeColor} cx="200" cy="200" r={15}/>
              {/*<circle ref="circle1" fill="#61DAFB" cx="0" cy="0" r={10} style={{transform: transforms[0], WebkitTransform: transforms[0]}}/>*/}
              {/*<circle ref="circle2" fill="#61DAFB" cx="0" cy="0" r={10} style={{transform: transforms[0], WebkitTransform: transforms[0]}}/>*/}
              {/*<circle ref="circle3" fill="#61DAFB" cx="0" cy="0" r={10} style={{transform: transforms[0], WebkitTransform: transforms[0]}}/>*/}

              <text className="Node-text" x="150" y="150" fill="black" fontSize={50}>{data}</text>
            </svg>
          </MtSvgLines>
        </div>
      </Draggable>
    );
  }
}