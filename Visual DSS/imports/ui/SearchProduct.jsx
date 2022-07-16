import React, { Component } from 'react';
import { Icon, Input, AutoComplete } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Products } from '/imports/api/products.js';

class SearchProduct extends Component {
  constructor(props) {
    super(props);
    this.onSelected = this.onSelected.bind(this);
  }

  onSelected(product) {
    this.props.onProductChange(product);
  }

  render() {
    return (
      <AutoComplete
        dataSource={this.props.products}
        placeholder="Search a product"
        filterOption={(inputValue, option) =>
          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={this.onSelected}
      >
        <Input suffix={<Icon type="search" className="certain-category-icon" />} />
      </AutoComplete>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('products');
  let products = Products.find({}).fetch();
  return {
    products: _.map(products, p => p.product).sort(),
  };
})(SearchProduct);
