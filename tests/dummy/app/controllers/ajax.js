import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';
import AjaxTableLazyDataSource from '../views/ajax-table-lazy-data-source';

export default Ember.Controller.extend({
  // FIXME(azirbel): Change all of these to "tableColumns" and "tableContent"
  columns: function() {
    var avatar = ColumnDefinition.create({
      savedWidth: 80,
      headerCellName: 'avatar',
      tableCellViewClass: 'ajax-image-table-cell',
      contentPath: 'avatar'
    });
    var columnNames = ['login', 'type', 'createdAt'];
    var columns = columnNames.map(function(key) {
      return ColumnDefinition.create({
        savedWidth: 150,
        headerCellName: key.w(),
        contentPath: key
      });
    });
    columns.unshift(avatar);
    return columns;
  }.property(),

  content: function() {
    return AjaxTableLazyDataSource.create({
      content: new Array(100)
    });
  }.property()
});
