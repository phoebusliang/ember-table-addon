import Ember from 'ember';
import TableContainer from '../views/table-container';
import ShowHorizontalScrollMixin from '../mixins/show-horizontal-scroll';
import RegisterTableComponentMixin from '../mixins/register-table-component';

export default TableContainer.extend(
ShowHorizontalScrollMixin, RegisterTableComponentMixin, {
  templateName: 'header-container',
  classNames: ['ember-table-table-container',
      'ember-table-fixed-table-container',
      'ember-table-header-container'],
  height: Ember.computed.alias('tableComponent._headerHeight'),
  width: Ember.computed.alias('tableComponent._tableContainerWidth')
});
