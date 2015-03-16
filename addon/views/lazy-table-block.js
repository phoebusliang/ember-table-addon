import Ember from 'ember';

export default Ember.LazyContainerView.extend(
Ember.Table.RegisterTableComponentMixin, {
  classNames: ['ember-table-table-block'],
  styleBindings: ['width'],
  itemViewClass: Ember.computed.alias('tableComponent.tableRowViewClass'),
  rowHeight: Ember.computed.alias('tableComponent.rowHeight'),
  columns: null,
  content: null,
  scrollLeft: null,
  scrollTop: null,

  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }).observes('scrollLeft')
});
