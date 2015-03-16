import Ember from 'ember';

export default Ember.Table.TableContainer.extend(
Ember.MouseWheelHandlerMixin, Ember.TouchMoveHandlerMixin,
Ember.ScrollHandlerMixin, Ember.Table.ShowHorizontalScrollMixin,
Ember.Table.RegisterTableComponentMixin, {
  templateName: 'body-container',
  classNames: ['ember-table-table-container', 'ember-table-body-container', 'antiscroll-wrap'],

  height: Ember.computed.alias('tableComponent._bodyHeight'),
  width: Ember.computed.alias('tableComponent._width'),
  scrollTop: Ember.computed.alias('tableComponent._tableScrollTop'),
  scrollLeft: Ember.computed.alias('tableComponent._tableScrollLeft'),
  scrollElementSelector: '.antiscroll-inner',

  onScroll: function(event) {
    this.set('scrollTop', event.target.scrollTop);
    return event.preventDefault();
  },

  // `event` here is a jQuery event
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }
    var scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    event.preventDefault();
  },

  // `event` here is a jQuery event
  onTouchMove: function(event, deltaX, deltaY) {
    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }
    var scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    event.preventDefault();
  }
});
