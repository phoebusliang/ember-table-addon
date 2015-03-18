import Ember from 'ember';
import TableCell from '../views/table-cell';

export default TableCell.extend({
  template: Ember.Handlebars.compile(''),
  heightBinding: 'controller.rowHeight',

  onContentOrSizeDidChange: Ember.observer(function() {
    this.$('svg').remove();
    return this.renderD3View();
  }).observes('row', 'width'),

  didInsertElement: function() {
    return this.renderD3View();
  },

  renderD3View: function() {
    var data = this.get('row.timeseries');
    if (!data) {
      return;
    }
    var h = this.get('height');
    var w = this.get('width');
    var p = 2;
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var len = data.length;
    var fill = d3.scale.category10();
    var xscale = d3.scale.linear().domain([0, len]).range([p, w - p]);
    var yscale = d3.scale.linear().domain([min, max]).range([h - p, p]);
    var line = d3.svg.line().x(function(d, i) {
      return xscale(i);
    }).y(function(d) {
      return yscale(d);
    });
    var svg = d3.select('#' + (this.get('elementId'))).append('svg:svg').attr('height', h).attr('width', w);
    var g = svg.append('svg:g');
    return g.append('svg:path').attr('d', line(data)).attr('stroke', function() {
      return fill(Math.round(Math.random()) * 10);
    }).attr('fill', 'none');
  }
});
