import Ember from 'ember';

export default Ember.Table.TableContainer.extend(
Ember.Table.ShowHorizontalScrollMixin,
Ember.Table.RegisterTableComponentMixin, {
  templateName: 'header-container',
  classNames: ['ember-table-table-container',
      'ember-table-fixed-table-container',
      'ember-table-header-container'],
  height: Ember.computed.alias('tableComponent._headerHeight'),
  width: Ember.computed.alias('tableComponent._tableContainerWidth')
});
