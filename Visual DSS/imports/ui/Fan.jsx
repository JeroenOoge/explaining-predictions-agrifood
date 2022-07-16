import React from 'react';
import d3 from 'd3';

class Fan extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  getClassName() {
    return `fan-${this.props.country.replace(" ","-").concat(this.props.level)}`;
  }

  drawFan() {
    const className = this.getClassName();
    d3.select(`.${className}`)
      .datum(this.props.data)
      .style("fill", this.props.colour)
      .style("opacity", this.props.opacity)
      .transition(d3.transition().duration(500))
      .attr("d", d3.area()
        .x(d => this.props.scaleX(d.valueX))
        .y0(d => this.props.scaleY(d.lower))
        .y1(d => this.props.scaleY(d.upper))
      )
  }

  handleMouseEnter() {
    this.props.onFanMouseEnterOut(this.props.level, this.props.country);
  }

  handleMouseOut() {
    this.props.onFanMouseEnterOut(null, null);
  }

  componentDidMount() {
    this.drawFan();
  }

  componentDidUpdate() {
    this.drawFan();
  }

  render() {
    const className = this.getClassName() + " fan";
    return(
      <path className={className}
            onMouseEnter={this.handleMouseEnter}
            onMouseOut={this.handleMouseOut} />
    );
  }
}

export default Fan;
