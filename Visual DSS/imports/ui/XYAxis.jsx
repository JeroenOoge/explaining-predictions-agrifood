import React from 'react';
import Axis from './Axis.jsx';

class XYAxis extends React.Component {
  render() {
    return (
      <g className="axis-group">
        <Axis scale={this.props.scaleX}
              orient="bottom"
              transform={`translate(0, ${this.props.height})`} />
        <Axis scale={this.props.scaleY}
              orient="left"
              transform="translate(0, 0)"
              width={this.props.width} />
      </g>
    );
  }
};

export default XYAxis;
