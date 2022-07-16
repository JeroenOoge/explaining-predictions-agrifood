import React from 'react';
import d3 from 'd3';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tooltip" style={{left: this.props.x, top: this.props.y}}>
        {this.props.content}
      </div>
    );
  }
}

export default Tooltip;
