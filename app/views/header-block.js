import Ember from 'ember';
import TableBlock from '../views/table-block';

export default TableBlock.extend({
  classNames: ['ember-table-header-block'],
  // FIXME(azirbel): Possibly creating createChildViews error
  itemViewClass: 'header-row',

  content: Ember.computed(function() {
    return [this.get('columns')];
  }).property('columns')
});
