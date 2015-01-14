/* Tell JSHint not to worry about _ not being defined */
/* global _:false */

import Ember from 'ember';

export default Ember.Controller.extend({
  columns: Ember.computed(function() {
    var closeColumn, dateColumn, highColumn, lowColumn, openColumn;
    dateColumn = Ember.Table.ColumnDefinition.create({
      savedWidth: 150,
      textAlign: 'text-align-left',
      headerCellName: 'Date',
      getCellContent: function(row) {
        return row.get('date').toDateString();
      }
    });
    openColumn = Ember.Table.ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Open',
      getCellContent: function(row) {
        return row.get('open').toFixed(2);
      }
    });
    highColumn = Ember.Table.ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'High',
      getCellContent: function(row) {
        return row.get('high').toFixed(2);
      }
    });
    lowColumn = Ember.Table.ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Low',
      getCellContent: function(row) {
        return row.get('low').toFixed(2);
      }
    });
    closeColumn = Ember.Table.ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Close',
      getCellContent: function(row) {
        return row.get('close').toFixed(2);
      }
    });
    return [dateColumn, openColumn, highColumn, lowColumn, closeColumn];
  }),
  content: Ember.computed(function() {
    return _.range(100).map(function(index) {
      var date = new Date();
      date.setDate(date.getDate() + index);
      return {
        date: date,
        open: Math.random() * 100 - 50,
        high: Math.random() * 100 - 50,
        low: Math.random() * 100 - 50,
        close: Math.random() * 100 - 50,
        volume: Math.random() * 1000000
      };
    });
  })
});

