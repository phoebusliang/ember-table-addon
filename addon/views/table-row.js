import Ember from 'ember';

export default Ember.LazyItemView.extend(
Ember.Table.RegisterTableComponentMixin, {
  templateName: 'table-row',
  classNames: 'ember-table-table-row',
  classNameBindings: ['row.isHovered:ember-table-hover',
      'row.isSelected:ember-table-selected',
      'row.rowStyle',
      'isLastRow:ember-table-last-row'],
  styleBindings: ['width', 'height'],
  row: Ember.computed.alias('content'),
  columns: Ember.computed.alias('parentView.columns'),
  width: Ember.computed.alias('tableComponent._rowWidth'),
  height: Ember.computed.alias('tableComponent.rowHeight'),

  isLastRow: Ember.computed(function() {
    return this.get('row') ===
        this.get('tableComponent.bodyContent.lastObject');
  }).property('tableComponent.bodyContent.lastObject', 'row'),

  // TODO(azirbel): Could simplify slightly via
  // this.set('row.isHovered', true) and remove the temp variable.
  // Also applies below/elsewhere.
  mouseEnter: function() {
    var row = this.get('row');
    if (row) {
      row.set('isHovered', true);
    }
  },

  mouseLeave: function() {
    var row = this.get('row');
    if (row) {
      row.set('isHovered', false);
    }
  },

  teardownContent: function() {
    var row = this.get('row');
    if (row) {
      row.set('isHovered', false);
    }
  }
});
