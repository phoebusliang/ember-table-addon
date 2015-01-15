import Ember from 'ember';
import TableCell from 'ember-table/views/table-cell';

export default TableCell.extend({
  templateName: 'bar_table/bar-cell',
  classNameBindings: ['column.color'],
  barWidth: Ember.computed(function() {
    var column, row, _ref;
    _ref = this.getProperties('column', 'row'), column = _ref.column, row = _ref.row;
    if (!(column && row)) {
      return 0;
    }
    return Math.round(+this.get('cellContent'));
  }).property('column', 'row', 'cellContent'),
  histogramStyle: Ember.computed(function() {
    return "width: " + (this.get('barWidth')) + "%;";
  }).property('barWidth')
});
