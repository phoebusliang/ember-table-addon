import Ember from 'ember';
import StyleBindingsMixin from '../mixins/style-bindings';
import RegisterTableComponentMixin from '../mixins/register-table-component';

export default Ember.View.extend(
StyleBindingsMixin, RegisterTableComponentMixin, {
  classNames: 'ember-table-column-sortable-indicator',
  classNameBindings: 'tableComponent._isShowingSortableIndicator:active',
  styleBindings: ['left', 'height'],
  left: Ember.computed.alias('tableComponent._sortableIndicatorLeft'),
  height: Ember.computed.alias('tableComponent._height')
});
