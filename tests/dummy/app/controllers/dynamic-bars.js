import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';

export default Ember.Controller.extend({
  init: function() {
    return setInterval((function(_this) {
      return function() {
        return _this.get('content').forEach(function(item) {
          item.set('value1', _this.getNextValue(item.get('value1')));
          item.set('value2', _this.getNextValue(item.get('value2')));
          item.set('value3', _this.getNextValue(item.get('value3')));
          item.set('value4', _this.getNextValue(item.get('value4')));
          return item.set('value5', _this.getNextValue(item.get('value5')));
        });
      };
    })(this), 1500);
  },

  getNextValue: function(current) {
    current = current + (Math.random() * 10 - 5);
    current = Math.min(100, current);
    current = Math.max(0, current);
    return current;
  },

  columns: function() {
    var colors = ['blue', 'teal', 'green', 'yellow', 'orange'];
    var firstColumn = ColumnDefinition.create({
      savedWidth: 50,
      headerCellName: 'Name',
      contentPath: 'key'
    });
    var columns = colors.map(function(color, index) {
      return ColumnDefinition.create({
        color: color,
        headerCellName: 'Bar',
        tableCellViewClass: 'bar-table-cell',
        contentPath: "value" + (index + 1)
      });
    });
    columns.unshift(firstColumn);
    return columns;
  }.property(),

  content: function() {
    return _.range(100).map(function(index) {
      return Ember.Object.create({
        key: index,
        value1: Math.random() * 80 + 10,
        value2: Math.random() * 80 + 10,
        value3: Math.random() * 80 + 10,
        value4: Math.random() * 80 + 10,
        value5: Math.random() * 80 + 10
      });
    });
  }.property()
});
