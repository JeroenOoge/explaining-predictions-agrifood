import React from 'react';
import d3 from 'd3';
import XYAxis from './XYAxis.jsx';
import Line from './Line.jsx';
import FanBundle from './FanBundle.jsx';
import Bullet from './Bullet.jsx';
import Tooltip from './Tooltip.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Data } from '/imports/api/products.js';
import moment from 'moment';

class FanChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      height: 0,
      width: 0,
      mouseX: 0,
      mouseY: 0,
      tooltipVisible: false,
      activeFan: { level: null, country: null },
    };
    this.refFanChart = React.createRef();
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleFanMouseEnterOut = this.handleFanMouseEnterOut.bind(this);
  }

  handleMouseMove() {
    this.setState({
      mouseX: event.clientX,
      mouseY: event.clientY,
      tooltipVisible: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      mouseX: 0,
      mouseY: 0,
      tooltipVisible: false,
    });
  }

  handleFanMouseEnterOut(level, country) {
    this.setState({ activeFan: { level: level, country: country } });
  }

  drawTooltip(scaleX) {
    const x = this.state.mouseX - this.props.margin.left - this.refFanChart.current.offsetLeft,
      previous = this.props.data.filter(d => scaleX(d.date) <= x);
    if (previous.length > 0) {
      return (
        <Tooltip x={this.state.mouseX + 8 + "px"}
          y={this.state.mouseY + 8 + "px"}
          content={this.getTooltipText(previous, scaleX, x)} />
      );
    }
  }

  getTooltipText(previous, scaleX, x) {
    let text;
    const lastPrevious = previous[previous.length - 1],
      dateString = moment(lastPrevious.date).format("D/M/YYYY");
    if (this.state.activeFan.level != null && this.state.activeFan.country != null) {
      const activePrevious = previous.filter(d => d.country == this.state.activeFan.country),
        last = activePrevious[activePrevious.length - 1],
        max = parseFloat(last["upr".concat(this.state.activeFan.level)]).toFixed(2),
        min = parseFloat(last["lwr".concat(this.state.activeFan.level)]).toFixed(2);
      text = <><div><span className="bold">Prediction</span> ({dateString})</div>In {this.state.activeFan.level} out of 100 occasions, the product price lies between {min} and {max}.</>;
    } else {
      text = <div><span className="bold">Price</span> ({dateString})</div>;
      this.props.countries.forEach(function (country) {
        const countryPast = this.props.dataPast.filter(d => d.country == country),
          countryPrevious = previous.filter(d => d.country == country && d.date.getTime() == lastPrevious.date.getTime());
        if (countryPrevious.length > 0) {
          const last = countryPast[countryPast.length - 1],
            lastX = Math.round(scaleX(last.date)),
            addPastText = this.props.drawKnownData && x <= lastX,
            addFutureText = this.props.drawFuturePredictedData && x > lastX,
            addText = addPastText || addFutureText,
            lastPrevious = countryPrevious[countryPrevious.length - 1];
          addText && (text = <>{text}<div className={`tooltip-${country}`}>
            <Bullet ariaLabel={this.props.country} colour={this.props.colours(country)} />
            {isNaN(lastPrevious.price) ? <>{parseFloat(lastPrevious.fit).toFixed(2)}<span className="label">predicted</span></> : parseFloat(lastPrevious.price).toFixed(2)}
          </div></>);
        }
      }, this);
    }
    return text;
  }

  drawDots(scaleX, scaleY, graphHeight) {
    let dots = [];
    const x = this.state.mouseX - this.props.margin.left - this.refFanChart.current.offsetLeft,
      previous = this.props.data.filter(d => scaleX(d.date) <= x);
    if (previous.length > 0) {
      const lastPrevious = previous[previous.length - 1],
        lastPreviousX = scaleX(lastPrevious.date);
      dots.push(<line className="time-indicator" x1={scaleX(lastPrevious.date)} x2={scaleX(lastPrevious.date)} y1={graphHeight} y2="0" key="line" />);
      this.state.activeFan.level == null && this.props.countries.forEach(function (country) {
        const countryPast = this.props.dataPast.filter(d => d.country == country),
          countryPrevious = previous.filter(d => d.country == country && d.date.getTime() == lastPrevious.date.getTime());
        if (countryPrevious.length > 0) {
          const last = countryPast[countryPast.length - 1],
            lastX = Math.round(scaleX(last.date)),
            drawPastDots = this.props.drawKnownData && x <= lastX,
            drawFutureDots = this.props.drawFuturePredictedData && x > lastX,
            draw = drawPastDots || drawFutureDots,
            lastPrevious = countryPrevious[countryPrevious.length - 1],
            y = (isNaN(lastPrevious.price)) ? lastPrevious.fit : lastPrevious.price;
          draw && dots.push(<circle cx={lastPreviousX} cy={scaleY(y)} r="4" style={{ fill: this.props.colours(country) }} key={country.replace(" ", "-")} />);
        }
      }, this);
    }
    return dots;
  }

  getLine(data, country, scaleX, scaleY, type) {
    const colour = this.props.colours(country),
      key = country.replace(" ", "-") + "-" + type;
    let countryData = [];
    data.filter(d => d.country == country)
      .sort((a, b) => a.date - b.date)
      .forEach(d => countryData.push({
        valueX: d.date,
        valueY: (type == "known") ? d.price : d.fit,
      }));
    return (
      <Line scaleX={scaleX} scaleY={scaleY} data={countryData} name={country.replace(" ", "-")} key={key} colour={colour} type={type} />
    );
  }

  getFanBundle(data, country, scaleX, scaleY) {
    const colour = this.props.colours(country),
      key = country.replace(" ", "-"),
      fanBundleData = data.filter(d => d.country == country);
    return (
      <FanBundle scaleX={scaleX} scaleY={scaleY} data={fanBundleData} country={country} key={key} colour={colour} onFanMouseEnterOut={this.handleFanMouseEnterOut} />
    );
  }

  drawLinesAndFans(scaleX, scaleY) {
    let fitData = [];
    this.props.dataPast.forEach(d => fitData.push({ valueX: d.date, valueY: d.fit }));

    let components = [];
    this.props.countries.forEach(function (country) {
      const countryData = this.props.dataPast.filter(d => d.country == country);
      let last = { ...countryData[countryData.length - 1] };
      last.fit = last.price;
      const predictedData = [...this.props.dataFuture, last];
      if (this.props.drawKnownData) {
        components.push(this.getLine(this.props.dataPast, country, scaleX, scaleY, "known"));
      }
      if (this.props.drawFuturePredictedData) {
        components.push(this.getLine(predictedData, country, scaleX, scaleY, "prediction"));
      }
      if (this.props.drawPastPredictedData) {
        components.push(this.getLine(this.props.dataPast, country, scaleX, scaleY, "fit"));
      }
      if (this.props.drawPastFanBundle && this.props.drawFutureFanBundle) {
        components.push(this.getFanBundle(this.props.data, country, scaleX, scaleY));
      } else if (this.props.drawPastFanBundle) {
        components.push(this.getFanBundle(this.props.dataPast, country, scaleX, scaleY));
      } else if (this.props.drawFutureFanBundle) {
        predictedData.pop();
        components.push(this.getFanBundle(predictedData, country, scaleX, scaleY));
      }
    }, this);
    return components;
  }

  componentDidMount() {
    this.setState({
      height: this.refFanChart.current.offsetHeight,
      width: this.refFanChart.current.offsetWidth,
      isMounted: true,
    });
  }

  getExtentX() {
    let data = [];
    if (this.props.drawKnownData || this.props.drawPastFanBundle || this.props.drawPastPredictedData) {
      data = data.concat(this.props.dataPast);
    }
    if (this.props.drawFuturePredictedData || this.props.drawFutureFanBundle) {
      data = data.concat(this.props.dataFuture);
    }
    return d3.extent(data, d => d.date);
  }
  getMaxY() {
    let data = [];
    if (this.props.drawKnownData) {
      data = data.concat(this.props.dataPast.map(d => d.price));
    }
    if (this.props.drawPastPredictedData) {
      data = data.concat(this.props.dataPast.map(d => d.fit));
    }
    if (this.props.drawFuturePredictedData) {
      data = data.concat(this.props.dataFuture.map(d => d.fit));
    }
    if (this.props.drawPastFanBundle) {
      data = data.concat(this.props.dataPast.map(d => d.upr99));
    }
    if (this.props.drawFutureFanBundle) {
      data = data.concat(this.props.dataFuture.map(d => d.upr99));
    }
    return d3.max(data);
  }

  render() {
    const graphHeight = this.state.height - this.props.margin.top - this.props.margin.bottom,
      graphWidth = this.state.width - this.props.margin.left - this.props.margin.right;
    var scaleX = d3.scaleTime()
      .domain(this.getExtentX())
      .range([0, graphWidth]);
    var scaleY = d3.scaleLinear()
      .domain([0, this.getMaxY()])
      .range([graphHeight, 0]);
    let svg, tooltip;
    if (this.state.isMounted) {
      tooltip = this.state.tooltipVisible && this.drawTooltip(scaleX);
      svg = <svg height={this.state.height} width={this.state.width}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}>
        <g transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}>
          <XYAxis scaleX={scaleX} scaleY={scaleY} height={graphHeight} width={graphWidth} />
          {this.drawDots(scaleX, scaleY, graphHeight)}
          {this.drawLinesAndFans(scaleX, scaleY)}
        </g>
      </svg>
    }

    return (
      <div className="fan-chart" ref={this.refFanChart}>
        {tooltip}
        {svg}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe('data', props.product);
  let data = Data.find({}).fetch()
    .filter(d => props.countries.includes(d.country));
  data.forEach(d => d.date = new Date(d.millisSinceEpoch));
  data = data.sort((a, b) => a.date - b.date);
  return {
    data: data,
    dataPast: data.filter(d => !isNaN(d.price)),
    dataFuture: data.filter(d => isNaN(d.price) && !isNaN(d.fit)),
  }
})(FanChart);
