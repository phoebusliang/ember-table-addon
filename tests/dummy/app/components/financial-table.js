import Ember from 'ember';
import TableComponent from 'ember-table/components/ember-table';
import ColumnDefinition from 'ember-table/column-definition';
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
  numFixedColumns: 1,
  isCollapsed: false,
  isHeaderHeightResizable: true,
  rowHeight: 30,
  hasHeader: true,
  hasFooter: true,
  headerHeight: 70,
  sortAscending: false,
  sortColumn: null,
  actions: {
    toggleTableCollapse: function() {
      var children, isCollapsed;
      this.toggleProperty('isCollapsed');
      isCollapsed = this.get('isCollapsed');
      children = this.get('root.children');
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
  data: null,
  columns: Ember.computed(function() {
    var columns, data, names;
    data = this.get('data');
    if (!data) {
      return;
    }
    names = this.get('data.value_factors').getEach('display_name');
    columns = names.map(function(name, index) {
      return ColumnDefinition.create({
        index: index,
        headerCellName: name,
        headerCellView: 'financial-table-header-cell',
        tableCellView: 'financial-table-cell',
        getCellContent: function(row) {
          var object;
          object = row.get('values')[this.get('index')];
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
  }).property('data.valueFactors.@each', 'groupingColumn'),
  groupingColumn: Ember.computed(function() {
    var groupingFactors, name;
    groupingFactors = this.get('data.grouping_factors');
    name = groupingFactors.getEach('display_name').join(' ▸ ');
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
  }).property('data.grouping_factors.@each'),
  root: Ember.computed(function() {
    var data;
    data = this.get('data');
    if (!data) {
      return;
    }
    return this.createTree(null, data.root);
  }).property('data', 'sortAscending', 'sortColumn'),
  rows: Ember.computed(function() {
    var maxGroupingLevel, root, rows;
    root = this.get('root');
    if (!root) {
      return Ember.A();
    }
    rows = this.flattenTree(null, root, Ember.A());
    this.computeStyles(null, root);
    maxGroupingLevel = Math.max.apply(rows.getEach('groupingLevel'));
    rows.forEach(function(row) {
      return row.computeRowStyle(maxGroupingLevel);
    });
    return rows;
  }).property('root'),
  bodyContent: Ember.computed(function() {
    var rows;
    rows = this.get('rows');
    if (!rows) {
      return Ember.A();
    }
    rows = rows.slice(1, rows.get('length'));
    return rows.filterProperty('isShowing');
  }).property('rows'),
  footerContent: Ember.computed(function() {
    var rows;
    rows = this.get('rows');
    if (!rows) {
      return Ember.A();
    }
    return rows.slice(0, 1);
  }).property('rows'),
  orderBy: function(item1, item2) {
    var result, sortAscending, sortColumn, value1, value2;
    sortColumn = this.get('sortColumn');
    sortAscending = this.get('sortAscending');
    if (!sortColumn) {
      return 1;
    }
    value1 = sortColumn.getCellContent(item1.get('content'));
    value2 = sortColumn.getCellContent(item2.get('content'));
    result = Ember.compare(value1, value2);
    if (sortAscending) {
      return result;
    } else {
      return -result;
    }
  },
  createTree: function(parent, node) {
    var children, row;
    row = FinancialTableTreeRow.create({
      parentController: this
    });
    children = (node.children || []).map((function(_this) {
      return function(child) {
        return _this.createTree(row, child);
      };
    })(this));
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
  }
});
