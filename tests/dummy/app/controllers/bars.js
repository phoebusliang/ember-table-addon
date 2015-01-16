/* global _ */

import Ember from 'ember';

export default Ember.Controller.extend({
  columns: Ember.computed(function() {
    var colors, column1, columns;
    colors = ['blue', 'teal', 'green', 'yellow', 'orange'];
    column1 = Ember.Table.ColumnDefinition.create({
      savedWidth: 50,
      headerCellName: 'Name',
      contentPath: 'key'
    });
    columns = colors.map(function(color, index) {
      return Ember.Table.ColumnDefinition.create({
        color: color,
        headerCellName: 'Bar',
        tableCellViewClass: 'bar-table-cell',
        contentPath: "value" + (index + 1)
      });
    });
    columns.unshift(column1);
    return columns;
  }),
  content: Ember.computed(function() {
    return _.range(100).map(function(index) {
      return {
        key: index,
        value1: Math.random() * 80 + 10,
        value2: Math.random() * 80 + 10,
        value3: Math.random() * 80 + 10,
        value4: Math.random() * 80 + 10,
        value5: Math.random() * 80 + 10
      };
    });
  })
});
