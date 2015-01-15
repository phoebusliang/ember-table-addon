import Ember from 'ember';
import ColumnDefinition from 'ember-table/column-definition';
import AjaxTableLazyDataSource from '../views/ajax-table-lazy-data-source';

export default Ember.Controller.extend({
  // FIXME(azirbel): Change all of these to "tableColumns" and "tableContent"
  columns: Ember.computed(function() {
    var avatar, columnNames, columns;
    avatar = ColumnDefinition.create({
      savedWidth: 80,
      headerCellName: 'avatar',
      tableCellViewClass: 'ajax-image-table-cell',
      contentPath: 'avatar'
    });
    columnNames = ['login', 'type', 'createdAt'];
    columns = columnNames.map(function(key) {
      return ColumnDefinition.create({
        savedWidth: 150,
        headerCellName: key.w(),
        contentPath: key
      });
    });
    columns.unshift(avatar);
    return columns;
  }),
  content: Ember.computed(function() {
    return AjaxTableLazyDataSource.create({
      content: new Array(100)
    });
  }).property('numRows')
});

