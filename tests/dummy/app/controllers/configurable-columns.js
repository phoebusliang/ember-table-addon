import Ember from 'ember';
import ConfigurableColumnDefinition from '../views/configurable-column-definition';

export default Ember.Controller.extend({
  numRows: 100,
  isFluid: false,
  columnMode: Ember.computed(function() {
    if (this.get('isFluid')) {
      return 'fluid';
    } else {
      return 'standard';
    }
  }).property('isFluid'),
  showTable: true,
  columns: Ember.computed(function() {
    var closeColumn, dateColumn, highColumn, lowColumn, openColumn;
    dateColumn = ConfigurableColumnDefinition.create({
      textAlign: 'text-align-left',
      headerCellName: 'Date',
      minWidth: 150,
      getCellContent: function(row) {
        return row.get('date').toDateString();
      }
    });
    openColumn = ConfigurableColumnDefinition.create({
      headerCellName: 'Open',
      getCellContent: function(row) {
        return row.get('open').toFixed(2);
      }
    });
    highColumn = ConfigurableColumnDefinition.create({
      headerCellName: 'High',
      getCellContent: function(row) {
        return row.get('high').toFixed(2);
      }
    });
    lowColumn = ConfigurableColumnDefinition.create({
      headerCellName: 'Low',
      getCellContent: function(row) {
        return row.get('low').toFixed(2);
      }
    });
    closeColumn = ConfigurableColumnDefinition.create({
      headerCellName: 'Close',
      getCellContent: function(row) {
        return row.get('close').toFixed(2);
      }
    });
    return [dateColumn, openColumn, highColumn, lowColumn, closeColumn];
  }),
  content: Ember.computed(function() {
    var _results;
    return (function() {
      _results = [];
      for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(function(index) {
      var date;
      date = new Date();
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
  }).property('numRows'),
  demoTableWidth: void 0,
  updateDemoTableWidth: function(newWidth) {
    return this.set('demoTableWidth', newWidth);
  },
  actions: {
    refreshTable: function() {
      this.set('showTable', false);
      return Ember.run.next((function(_this) {
        return function() {
          return _this.set('showTable', true);
        };
      })(this));
    }
  }
});
