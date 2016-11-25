/**
 * Created by Dor on 11/12/2016.
 */

import React from 'react';
import {DEFAULT_COLOR} from './../utils';
import './Edge.css'

export default class Edge extends React.Component {
  render() {
    const {linesArray} = this.props;
    return (
      <div className="Edge">
        <svg width={1000} height={500}>
          <g fill="#61DAFB">
            {linesArray.map(line => <line {...line} style={{stroke:DEFAULT_COLOR, strokeWidth: 2}} />)}
          </g>
        </svg>
      </div>
    )
  }
}
