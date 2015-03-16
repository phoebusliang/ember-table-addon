import Ember from 'ember';

export default Ember.View.extend(
Ember.AddeparMixins.StyleBindingsMixin,
Ember.Table.RegisterTableComponentMixin, {
  classNames: ['ember-table-scroll-panel'],
  styleBindings: ['width', 'height'],
  width: Ember.computed.alias('tableComponent._tableColumnsWidth'),
  height: Ember.computed.alias('tableComponent._tableContentHeight')
});
