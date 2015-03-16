import Ember from 'ember';

export default Ember.View.extend(
Ember.AddeparMixins.StyleBindingsMixin,
Ember.Table.RegisterTableComponentMixin, {
  classNames: 'ember-table-column-sortable-indicator',
  classNameBindings: 'tableComponent._isShowingSortableIndicator:active',
  styleBindings: ['left', 'height'],
  left: Ember.computed.alias('tableComponent._sortableIndicatorLeft'),
  height: Ember.computed.alias('tableComponent._height')
});
