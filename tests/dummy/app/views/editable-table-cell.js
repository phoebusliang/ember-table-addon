import Ember from 'ember';
import TableCell from '../views/table-cell';

export default TableCell.extend({
  className: 'editable-table-cell',
  templateName: 'editable-table/editable-table-cell',
  isEditing: false,
  type: 'text',

  innerTextField: Ember.TextField.extend({
    typeBinding: 'parentView.type',
    valueBinding: 'parentView.cellContent',
    didInsertElement: function() {
      return this.$().focus();
    },
    focusOut: function() {
      return this.set('parentView.isEditing', false);
    }
  }),

  onRowContentDidChange: Ember.observer(function() {
    return this.set('isEditing', false);
  }).observes('row.content'),

  click: function(event) {
    this.set('isEditing', true);
    return event.stopPropagation();
  }
});
