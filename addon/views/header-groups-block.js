import Ember from 'ember';
import StyleBindingsMixin from 'ember-table/mixins/style-bindings';
import RegisterTableComponentMixin from 'ember-table/mixins/register-table-component';

export default Ember.CollectionView.extend(
StyleBindingsMixin, RegisterTableComponentMixin, {
    classNames: ['ember-table-right-table-block'],
    styleBindings: ['width', 'height'],
    columnGroups: undefined,
    headerHeight: undefined,
    itemViewClass: 'header-group',
    group:null,
    height: Ember.computed(function() {
      return this.get('headerHeight') * 2;
    }).property('headerHeight'),

    //table row width will change with each column width so we bind with it
    width: Ember.computed.alias('tableComponent._rowWidth'),

    //will bind to a property passed in from template, we expect that property reflect scroll position
    scrollLeft: null,

    //use JQuery scrollLeft, which needs inner element has a larger width than outter element,
    //header-groups-block acts as the inner element in scrolling
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().parent().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')

    createChildView: function(view, attrs) {
      console.log('header group block create child view');
      console.log('attrs --> ', attrs);
      var columnGroups = this.get('tableComponent.columnGroups');
      var childView = view.extend({
        scrollLeft: this.get('scrollLeft'),
        height: this.get('height'),
        group: columnGroups[attrs.contentIndex]
      });
      return this._super(childView, attrs);
    },

    content: Ember.computed(function() {
      var columnGroups = this.get('tableComponent.columnGroups');
      return columnGroups.map(function (columnGroup) {
        if (!!columnGroup.get('innerColumns')) {
          return [[columnGroup], columnGroup.get('columns')];
        } else {
          //columnGroup.set('headerCellHeight', this.get('height'));
          return [[columnGroup]];
        }
      });
    }).property('groups.@each'),


    // Options for jQuery UI sortable
    sortableOption: Ember.computed(function() {
      return {
        axis: 'x',
        containment: 'parent',
        cursor: 'move',
        helper: 'original',
        items: ".ember-table-header-block.sortable",
        opacity: 0.9,
        placeholder: 'ui-state-highlight',
        scroll: true,
        tolerance: 'intersect',
        update: Ember.$.proxy(this.onColumnSortDone, this),
        stop: Ember.$.proxy(this.onColumnSortStop, this),
        sort: Ember.$.proxy(this.onColumnSortChange, this)
      };
    }),

    onScrollLeftDidChange: Ember.observer(function() {
      this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft'),

    didInsertElement: function() {
      this._super();
      if (this.get('tableComponent.enableColumnReorder')) {
        this.$().sortable(this.get('sortableOption'));
      }
    },

    willDestroyElement: function() {
      if (this.get('tableComponent.enableColumnReorder')) {
        // TODO(azirbel): Get rid of this check, as in onColumnSortDone?
        var $divs = this.$();
        if ($divs) {
          $divs.sortable('destroy');
        }
      }
      this._super();
    },

    onColumnSortStop: function() {
      this.set('tableComponent._isShowingSortableIndicator', false);
    },

    onColumnSortChange: function() {
      var left = this.$('.ui-state-highlight').offset().left -
        this.$().closest('.ember-table-tables-container').offset().left;
      this.set('tableComponent._isShowingSortableIndicator', true);
      this.set('tableComponent._sortableIndicatorLeft', left);
    },

    onColumnSortDone: function(event, ui) {
      var newIndex = ui.item.index();
      console.log(newIndex);
      this.$().sortable('cancel');
      var view = Ember.View.views[ui.item.attr('id')];
      console.log('view --> ', view);
      var column = view.get('group');
      console.log('group --> ', column);
      this.get('tableComponent').onColumnSort(column, newIndex);
      this.set('tableComponent._isShowingSortableIndicator', false);
    }
  });
