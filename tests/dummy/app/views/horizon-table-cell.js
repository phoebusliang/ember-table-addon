import Ember from 'ember';
import TableCell from '../views/table-cell';
import d3HorizonUtils from '../utils/horizon';

export default TableCell.extend({
  template: Ember.Handlebars.compile(''),
  heightBinding: 'controller.rowHeight',

  horizonContent: Ember.computed(function() {
    var normal = d3.random.normal(1.5, 3);
    return _.range(100).map(function(index) {
      return [index, normal()];
    });
  }).property(),

  onWidthDidChange: Ember.observer(function() {
    this.$('svg').remove();
    return this.renderD3View();
  }).observes('width'),

  didInsertElement: function() {
    return this.onWidthDidChange();
  },

  renderD3View: function() {
    var chart, data, height, svg, width;
    width = this.get('width');
    height = this.get('height');
    data = this.get('horizonContent');
    chart = d3HorizonUtils.d3Horizon().width(width).height(height).bands(2).mode('mirror').interpolate('basis');
    svg = d3.select('#' + this.get('elementId')).append('svg').attr('width', width).attr('height', height);
    return svg.data([data]).call(chart);
  }
});

