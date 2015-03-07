import Ember from 'ember';
import TableCell from 'ember-table/views/table-cell';

export default TableCell.extend({
  classNames: 'rating-table-cell',
  templateName: 'editable-table/rating-table-cell',

  onRowContentDidChange: Ember.observer(function() {
    return this.applyRating(this.get('cellContent'));
  }).observes('cellContent'),

  didInsertElement: function() {
    this._super();
    return this.onRowContentDidChange();
  },

  applyRating: function(rating) {
    this.$('.rating span').removeClass('active');
    var span = this.$('.rating span').get(rating);
    return Ember.$(span).addClass('active');
  },

  click: function(event) {
    var rating = this.$('.rating span').index(event.target);
    if (rating === -1) {
      return;
    }
    this.get('column').setCellContent(this.get('row'), rating);
    return this.applyRating(rating);
  }
});
