import Ember from 'ember';
import TableComponent from 'ember-table/components/ember-table';
import ColumnDefinition from 'ember-table/models/column-definition';
import FinancialTableTreeRow from '../views/financial-table-tree-row';

// HACK: Used to help format table cells, should be refactored or use a library
// FIXME(azirbel): Should be a handlebars helper
var NumberHelper = {};
NumberHelper.toCurrency = function(num) {
  var value;
  if (isNaN(num) || !isFinite(num)) {
    return '-';
  }
  value = Math.abs(num).toFixed(2);
  value = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  return (num < 0 ? '-$' : '$') + value;
};

NumberHelper.toPercent = function(num) {
  if (isNaN(num) || !isFinite(num)) {
    return '-';
  }
  return Math.abs(num * 100).toFixed(2) + '%';
};

export default TableComponent.extend({
  // Overriding default properties
  numFixedColumns: 1,
  isCollapsed: false,
  isHeaderHeightResizable: true,
  rowHeight: 30,
  hasHeader: true,
  hasFooter: true,
  headerHeight: 70,

  // Custom properties
  sortAscending: false,
  sortColumn: null,

  /////////////////////////////////////////////////////////////////////////////
  // Data conversions
  /////////////////////////////////////////////////////////////////////////////

  data: null,

  columns: function() {
    var data = this.get('data');
    if (!data) {
      return;
    }
    var names = this.get('data.value_factors').getEach('display_name');
    var columns = names.map(function(name, index) {
      return ColumnDefinition.create({
        index: index,
        headerCellName: name,
        headerCellView: 'financial-table-header-cell',
        tableCellView: 'financial-table-cell',
        getCellContent: function(row) {
          var object = row.get('values')[this.get('index')];
          if (object.type === 'money') {
            return NumberHelper.toCurrency(object.value);
          }
          if (object.type === 'percent') {
            return NumberHelper.toPercent(object.value);
          }
          return "-";
        }
      });
    });
    columns.unshiftObject(this.get('groupingColumn'));
    return columns;
  }.property('data.valueFactors.@each', 'groupingColumn'),

  groupingColumn: function() {
    var groupingFactors = this.get('data.grouping_factors');
    var name = groupingFactors.getEach('display_name').join(' ▸ ');
    return ColumnDefinition.create({
      headerCellName: name,
      savedWidth: 400,
      isTreeColumn: true,
      isSortable: false,
      textAlign: 'text-align-left',
      headerCellView: 'financial-table-header-tree-cell',
      tableCellView: 'financial-table-tree-cell',
      contentPath: 'group_value'
    });
  }.property('data.grouping_factors.@each'),

  root: function() {
    var data = this.get('data');
    if (!data) {
      return;
    }
    return this.createTree(null, data.root);
  }.property('data', 'sortAscending', 'sortColumn'),

  rows: function() {
    var root = this.get('root');
    if (!root) {
      return Ember.A();
    }
    var rows = this.flattenTree(null, root, Ember.A());
    this.computeStyles(null, root);
    var maxGroupingLevel = Math.max.apply(rows.getEach('groupingLevel'));
    rows.forEach(function(row) {
      return row.computeRowStyle(maxGroupingLevel);
    });
    return rows;
  }.property('root'),

  // OPTIMIZATION HACK
  bodyContent: function() {
    var rows = this.get('rows');
    if (!rows) {
      return Ember.A();
    }
    rows = rows.slice(1, rows.get('length'));
    return rows.filterProperty('isShowing');
  }.property('rows'),

  footerContent: function() {
    var rows = this.get('rows');
    if (!rows) {
      return Ember.A();
    }
    return rows.slice(0, 1);
  }.property('rows'),

  orderBy: function(item1, item2) {
    var sortColumn = this.get('sortColumn');
    var sortAscending = this.get('sortAscending');
    if (!sortColumn) {
      return 1;
    }
    var value1 = sortColumn.getCellContent(item1.get('content'));
    var value2 = sortColumn.getCellContent(item2.get('content'));
    var result = Ember.compare(value1, value2);
    if (sortAscending) {
      return result;
    } else {
      return -result;
    }
  },

  createTree: function(parent, node) {
    var row = FinancialTableTreeRow.create({ parentController: this });
    // FIXME(azirbel): better map function and _this use
    var children = (node.children || []).map((function(_this) {
      return function(child) {
        return _this.createTree(row, child);
      };
    })(this));
    // TODO(Peter): Hack... only collapse table if it should collapseByDefault
    // and it is not the root. Currently the total row is the root, and if it
    // is collapse, it causes nothing to show in the table and there is no way
    // to get expand it.
    row.setProperties({
      isRoot: !parent,
      isLeaf: Ember.isEmpty(children),
      content: node,
      parent: parent,
      children: children,
      groupName: node.group_name,
      isCollapsed: false
    });
    return row;
  },

  // FIXME(azirbel): Don't use the word "parent"
  flattenTree: function(parent, node, rows) {
    rows.pushObject(node);
    (node.children || []).forEach((function(_this) {
      return function(child) {
        return _this.flattenTree(node, child, rows);
      };
    })(this));
    return rows;
  },

  computeStyles: function(parent, node) {
    node.computeStyles(parent);
    return node.get('children').forEach((function(_this) {
      return function(child) {
        return _this.computeStyles(node, child);
      };
    })(this));
  },

  actions: {
    toggleTableCollapse: function() {
      var isCollapsed = this.toggleProperty('isCollapsed');
      var children = this.get('root.children');
      if (!(children && children.get('length') > 0)) {
        return;
      }
      children.forEach(function(child) {
        return child.recursiveCollapse(isCollapsed);
      });
      return this.notifyPropertyChange('rows');
    },

    toggleCollapse: function(row) {
      row.toggleProperty('isCollapsed');
      return Ember.run.next(this, function() {
        return this.notifyPropertyChange('rows');
      });
    }
  },
});
