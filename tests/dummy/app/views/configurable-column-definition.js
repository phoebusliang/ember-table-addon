import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';

// We extend Ember.Table.ColumnDefinition for two reasons: to use custom
// getters/setters for savedWidth/minWidth/maxWidth so that they can be set via
// the configuration container, and to add properties which can be used for
// formatting.
export default ColumnDefinition.extend({
  savedWidth: void 0,

  savedWidthValue: Ember.computed(function(key, value) {
    if (arguments.length === 1) {
      return this.get('savedWidth');
    } else {
      this.set('savedWidth', parseInt(value));
      return this.get('savedWidth');
    }
  }).property('savedWidth'),

  minWidthValue: Ember.computed(function(key, value) {
    if (arguments.length === 1) {
      return this.get('minWidth');
    } else {
      this.set('minWidth', parseInt(value));
      return this.get('minWidth');
    }
  }).property('minWidth'),

  atMinWidth: Ember.computed(function() {
    return this.get('width') === this.get('minWidth');
  }).property('width', 'minWidth'),

  atMaxWidth: Ember.computed(function() {
    return this.get('width') === this.get('maxWidth');
  }).property('width', 'maxWidth'),

  maxWidth: undefined,

  maxWidthValue: Ember.computed(function(key, value) {
    if (arguments.length === 1) {
      return this.get('maxWidth');
    } else {
      this.set('maxWidth', parseInt(value));
      return this.get('maxWidth');
    }
  }).property('maxWidth'),

  headerCellNameLowerCase: Ember.computed(function() {
    return this.get('headerCellName').toLowerCase();
  }).property('headerCellName'),

  isDateCell: Ember.computed.equal('headerCellName', 'Date'),

  textAlignIsDefault: Ember.computed.equal('textAlign', 'text-align-right'),

  minWidthIsDefault: Ember.computed.equal('minWidth', 25)
});
