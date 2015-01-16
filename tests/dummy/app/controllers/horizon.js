/* global d3 */

import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';

export default Ember.Controller.extend({
  columns: Ember.computed(function() {
    var horizon, name;
    name = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Name',
      getCellContent: function(row) {
        return 'Horizon ' + row.get('name');
      }
    });
    horizon = ColumnDefinition.create({
      savedWidth: 600,
      headerCellName: 'Horizon',
      tableCellViewClass: 'horizon-table-cell',
      getCellContent: Ember.K
    });
    return [name, horizon];
  }),
  content: Ember.computed(function() {
    var normal, _results;
    normal = d3.random.normal(1.5, 3);
    return (function() {
      _results = [];
      for (var _i = 0, _ref = 100; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(function(num, index) {
      var data, _i, _results;
      data = (function() {
        _results = [];
        for (_i = 0; _i < 100; _i++){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(i) {
        return [i, normal()];
      });
      return {
        name: index,
        data: data
      };
    });
  })
});
