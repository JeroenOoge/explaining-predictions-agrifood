import React from 'react';
import { Checkbox } from 'antd';

class Checkboxes extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checkedValues) {
    this.props.onChange(checkedValues);
  };

  render() {
    const options = [
      {label: 'Past data', value: 'Past data' },
      {label: 'Future prediction', value: 'Future prediction'},
      {label: 'Future uncertainty', value: 'Future uncertainty'},
      {label: 'Past fit', value: 'Past fit'},
      {label: 'Past uncertainty', value: 'Past uncertainty'}
    ];
    return (
      <div className="checkboxes">
        <Checkbox.Group options={options} defaultValue={['Past data']} onChange={this.handleChange} />
      </div>
    );
  }
}

export default Checkboxes;
