import React from 'react';
import d3 from 'd3';
import Fan from './Fan.jsx';

class FanBundle extends React.Component {
  constructor(props) {
    super(props);
    this.handleFanMouseEnterOut = this.handleFanMouseEnterOut.bind(this);
  }

  handleFanMouseEnterOut(level, country) {
    this.props.onFanMouseEnterOut(level, country);
  }

  getFans() {
    const levels = Object.keys(this.props.data[0])
        .filter(n => n.indexOf("lwr") === 0)
        .map(n => n.substr(3, 4))
        .sort(function(a, b){return b-a}),
          maxLevel = d3.max(levels),
          minLevel = d3.min(levels);
    let fans = [];
    levels.forEach(function(level) {
      const l = (maxLevel - level) / (maxLevel - minLevel),
            opacityMin = 0.05,
            opacityMax = 0.15,
            opacity = opacityMin + (opacityMax - opacityMin) * l;
      let fanData = [];
      this.props.data.forEach(d => fanData.push({
        valueX: d.date,
        lower: parseFloat(d["lwr".concat(level)]),
        upper: parseFloat(d["upr".concat(level)]),
      }));
      fans.push(
       <Fan scaleX={this.props.scaleX} scaleY={this.props.scaleY} data={fanData} key={level} country={this.props.country} colour={this.props.colour} opacity={opacity} level={level} onFanMouseEnterOut={this.handleFanMouseEnterOut} />
      );
    }, this);
    return fans;
  }

  render() {
    return (
      <g className="fans">
        {(this.props.data.length > 0) && this.getFans()}
      </g>
    );
  }
}

export default FanBundle;
