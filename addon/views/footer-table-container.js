import Ember from 'ember';

export default Ember.Table.TableContainer.extend(
Ember.MouseWheelHandlerMixin, Ember.TouchMoveHandlerMixin,
Ember.Table.ShowHorizontalScrollMixin,
Ember.Table.RegisterTableComponentMixin, {
  templateName: 'footer-container',
  classNames: ['ember-table-table-container',
    'ember-table-fixed-table-container',
    'ember-table-footer-container'],
  styleBindings: 'top',
  height: Ember.computed.alias('tableComponent.footerHeight'),
  width: Ember.computed.alias('tableComponent._tableContainerWidth'),
  scrollLeft: Ember.computed.alias('tableComponent._tableScrollLeft'),

  top: Ember.computed(function() {
    var headerHeight = this.get('tableComponent._headerHeight');
    var contentHeight = this.get('tableComponent._tableContentHeight') +
        headerHeight;
    var bodyHeight = this.get('tableComponent._bodyHeight') + headerHeight;
    if (contentHeight < bodyHeight) {
      return contentHeight;
    } else {
      return bodyHeight;
    }
  }).property('tableComponent._bodyHeight', 'tableComponent._headerHeight',
      'tableComponent._tableContentHeight'),

  onMouseWheel: function(event, delta, deltaX) {
    var scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() +
        deltaX;
    this.set('scrollLeft', scrollLeft);
    event.preventDefault();
  },

  onTouchMove: function(event, deltaX) {
    var scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() +
        deltaX;
    this.set('scrollLeft', scrollLeft);
    event.preventDefault();
  }
});
