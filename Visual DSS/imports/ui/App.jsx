import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Data } from '/imports/api/products.js';
import d3 from 'd3';
import 'antd/dist/antd.css';
import FanChart from './FanChart.jsx';
import Countries from './Countries.jsx';
import SearchProduct from './SearchProduct.jsx';
import Checkboxes from './Checkboxes.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleCountriesChange = this.handleCountriesChange.bind(this);
    this.handleComponentsChange = this.handleComponentsChange.bind(this);
    this.state = {product: "", countries: [], colours: [], components: ['Past data']};
  }

  handleProductChange(product) {
    this.setState({
      product: product,
      countries: [],
      colours: [],
    });
  }

  handleCountriesChange(countries) {
    let colours = d3.scaleOrdinal(d3.schemeTableau10).domain(countries);
    this.setState({countries: countries, colours: colours});
  }

  handleComponentsChange(checkedValues) {
    this.setState({components: checkedValues});
  }

  drawFanChart() {
    if (this.state.countries.length > 0) {
     const margin = {top: 5, right: 0, bottom: 40, left: 40};
     return(<FanChart product={this.state.product}
                      countries={this.state.countries}
                      colours={this.state.colours}
                      margin={margin}
                      drawKnownData={this.state.components.includes('Past data')}
                      drawFuturePredictedData={this.state.components.includes('Future prediction')}
                      drawFutureFanBundle={this.state.components.includes('Future uncertainty')}
                      drawPastPredictedData={this.state.components.includes('Past fit')}
                      drawPastFanBundle={this.state.components.includes('Past uncertainty')} />);
    } else {
      return(<div className="fan-chart-dummy"></div>);
    }
  }

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Price evolution of</h2>
          <SearchProduct onProductChange={this.handleProductChange}/>
          <h2>in</h2>
          <Countries product={this.state.product}
                     countries={this.state.countries}
                     colours={this.state.colours}
                     onCountriesChange={this.handleCountriesChange} />
        </div>
        {this.drawFanChart()}
        <Checkboxes onChange={this.handleComponentsChange}/>
      </div>
    );
  }
};

export default App;
