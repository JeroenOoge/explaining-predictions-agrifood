import React from 'react';
import d3 from 'd3';

class Line extends React.Component {
  getClassName() {
    return(`line-${this.props.name}-${this.props.type}`);
  }

  drawLine() {
    const className = this.getClassName();
    d3.select(`.${className}`)
      .datum(this.props.data)
      .classed("line", true)
      .style("stroke", this.props.colour)
      .transition(d3.transition().duration(500))
      .attr("d", d3.line()
        .x(d => this.props.scaleX(d.valueX))
        .y(d => this.props.scaleY(d.valueY))
      );
  }

  componentDidMount() {
    this.drawLine();
  }

  componentDidUpdate() {
    this.drawLine();
  }

  render() {
    let className = this.getClassName() + " " + this.props.type;
    return (
      <path className={className} />
    );
  }
}

export default Line;
