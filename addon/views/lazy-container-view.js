import Ember from 'ember';
import StyleBindingsMixin from 'ember-table/mixins/style-bindings';

export default Ember.ContainerView.extend(
StyleBindingsMixin, {
  classNames: 'lazy-list-container',
  styleBindings: ['height'],
  content: null,
  itemViewClass: null,
  rowHeight: null,
  scrollTop: null,
  startIndex: null,
  init: function() {
    this._super();
    return this.onNumChildViewsDidChange();
  },
  height: Ember.computed(function() {
    return this.get('content.length') * this.get('rowHeight');
  }).property('content.length', 'rowHeight'),
  numChildViews: Ember.computed(function() {
    return this.get('numItemsShowing') + 2;
  }).property('numItemsShowing'),
  onNumChildViewsDidChange: Ember.observer(function() {
    var itemViewClass, newNumViews, numViewsToInsert, oldNumViews, view, viewsToRemove;
    view = this;
    itemViewClass = this.get('itemViewClass');
    if (typeof itemViewClass === 'string') {
      if (/[A-Z]+/.exec(itemViewClass)) {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      } else {
        itemViewClass = this.container.lookupFactory("view:" + itemViewClass);
      }
    }
    newNumViews = this.get('numChildViews');
    if (!(itemViewClass && newNumViews)) {
      return;
    }
    oldNumViews = this.get('childViews.length');
    numViewsToInsert = newNumViews - oldNumViews;
    if (numViewsToInsert < 0) {
      viewsToRemove = this.slice(newNumViews, oldNumViews);
      this.removeObjects(viewsToRemove);
    } else if (numViewsToInsert > 0) {
      for (var i = 0; i < numViewsToInsert; ++i) {
        this.pushObject(view.createChildView(itemViewClass));
      }
    }
    this.viewportDidChange();
  }, 'numChildViews', 'itemViewClass'),

  viewportDidChange: Ember.observer(function() {
    var clength, content, numShownViews, startIndex, childViews;
    childViews = this.get('childViews');
    content = this.getWithDefault('content', []);
    clength = content.get('length');
    numShownViews = Math.min(childViews.get('length'), clength);
    startIndex = this.get('startIndex');
    if (startIndex + numShownViews >= clength) {
      startIndex = clength - numShownViews;
    }
    if (startIndex < 0) {
      startIndex = 0;
    }
    return childViews.forEach(function(childView, i) {
      var item, itemIndex;
      if (i >= numShownViews) {
        childView.set('content', null);
        return;
      }
      itemIndex = startIndex + i;
      childView = childViews.objectAt(itemIndex % numShownViews);
      item = content.objectAt(itemIndex);
      if (item !== childView.get('content')) {
        childView.teardownContent();
        childView.set('itemIndex', itemIndex);
        childView.set('content', item);
        return childView.prepareContent();
      }
    }, this);
  }, 'content.length', 'startIndex')
});
