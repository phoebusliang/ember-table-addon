/* global _ */

import Ember from 'ember';
import ColumnDefinition from 'ember-table/column-definition';

export default Ember.Controller.extend({
  columns: Ember.computed(function() {
    var columnNames, columns, dateColumn, ratingColumn;
    columnNames = ['open', 'close'];
    dateColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Date',
      tableCellViewClass: 'date-picker-table-cell',
      getCellContent: function(row) {
        return row.get('date').toString('yyyy-MM-dd');
      },
      setCellContent: function(row, value) {
        return row.set('date', value);
      }
    });
    ratingColumn = ColumnDefinition.create({
      savedWidth: 150,
      headerCellName: 'Analyst Rating',
      tableCellViewClass: 'rating-table-cell',
      contentPath: 'rating',
      setCellContent: function(row, value) {
        return row.set('rating', value);
      }
    });
    columns = columnNames.map(function(key) {
      var name;
      name = key.charAt(0).toUpperCase() + key.slice(1);
      return ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: name,
        tableCellViewClass: 'editable-table-cell',
        getCellContent: function(row) {
          return row.get(key).toFixed(2);
        },
        setCellContent: function(row, value) {
          return row.set(key, +value);
        }
      });
    });
    columns.unshift(ratingColumn);
    columns.unshift(dateColumn);
    return columns;
  }).property(),
  content: Ember.computed(function() {
    return _.range(100).map(function(index) {
      var date = new Date();
      date.setDate(date.getDate() + index);
      return {
        index: index,
        date: date,
        open: Math.random() * 100 - 50,
        close: Math.random() * 100 - 50,
        rating: Math.round(Math.random() * 4)
      };
    });
  })
});
