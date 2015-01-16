import Ember from 'ember';
import TableComponent from 'ember-table/components/ember-table';

// FIXME(azirbel): Migrate comments
export default TableComponent.extend({
  parentWidthObserver: Ember.observer(function() {
    return this.onResizeEnd();
  }, 'parentWidth')
});
