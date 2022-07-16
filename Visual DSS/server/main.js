import { Meteor } from 'meteor/meteor';
import { Products, Data } from '/imports/api/products.js';
import { check } from 'meteor/check';
import d3 from 'd3';

Meteor.publish('products', function () {
  return Products.find();
});

Meteor.publish('data', function (product) {
  check(product, String);
  return Data.find({product: product, country: {$ne : null}});
});

// Meteor.publish('prices', function (product, countries) {
//   check(product, String);
//   return Data.find({product: product, country: {$elemMatch : {$eq : countries}}});
// });
