import React from 'react';
// import d3 from 'd3';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App.jsx'

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
  // Meteor.call('loadData', 1, 2, (error, result) => {
  //   const timeParser = d3.timeParse("%Y-%m-%d");
  //   result.forEach(d => d.date = timeParser(d.date));
  //
  //   const data = result.sort((a, b) => a.date - b.date);
  //   render(<App data={data}/>, document.getElementById('react-target'));
  // });
});
