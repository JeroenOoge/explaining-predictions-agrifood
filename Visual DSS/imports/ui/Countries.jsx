import React from 'react';
import d3 from 'd3';
import { withTracker } from 'meteor/react-meteor-data';
import { Data } from '/imports/api/products.js';
import { Select } from 'antd';
const { Option } = Select;
import Bullet from './Bullet.jsx';

class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(countries) {
    if (countries.includes("Select all")) {
      countries = Array.from(new Set(this.props.data.map(d => d.country))).sort();
    }
    this.props.onCountriesChange(countries);
  }

  getLabel(country, colours) {
    const colour = this.props.countries.includes(country) ? colours(country) : "transparent";
    return (
      <Bullet ariaLabel={country} colour={colour} />
    );
  }

  getOptions() {
    // TODO: do filtering in client/main.js
    var countries = Array.from(new Set(this.props.data.map(d => d.country))).sort();
    let options = [];
    countries.unshift("Select all");
    countries.forEach(c => options.push(
      <Option key={c} label={c} value={c} className={(c == "Select all" ? "option-all" : "")}>
        {this.getLabel(c, this.props.colours)}
        {c}
      </Option>
    ));
    return options;
  }

  render() {
    return (
      <div className="countries-container">
        <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Select a country"
            defaultValue={[]}
            onChange={this.handleChange}
            allowClear={true}
            value={this.props.countries}
          >
            {this.getOptions()}
          </Select>
      </div>
    );
  }
}

export default withTracker ((props) => {
  Meteor.subscribe('data', props.product);
  return {
    data: Data.find({}).fetch(),
  };
})(Countries);
