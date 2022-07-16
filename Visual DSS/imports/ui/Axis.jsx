import React from 'react';
import d3 from 'd3';

class Axis extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const node = this.ref.current,
          orient = this.props.orient,
          scale = this.props.scale,
          tickPadding = 15;

    let axis;
    if (orient === "bottom") {
      axis = d3.axisBottom(scale);
    }
    if (orient === "left") {
      axis = d3.axisLeft(scale)
               .tickSizeInner(-this.props.width);
    }

    d3.select(`.axis-${orient}`)
      .transition(d3.transition().duration(500))
      .call(axis.tickPadding(tickPadding)
                .tickSizeOuter(0));

    if (orient === "left") {
      d3.select(".axis-left")
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick:first-of-type line").remove());
    }
  }

  render() {
    return (
      <g
        ref={this.props.ref}
        transform={this.props.transform}
        className={`axis-${this.props.orient} axis`}
      />
    );
  }
}

export default Axis;
