var Writer = require('broccoli-writer');
var fs = require('fs');
var path = require('path');
var Promise = require('RSVP').Promise;
var walk = require('walk-sync');

var Globals = function (inputTree) {
  options = {};
  if (!(this instanceof Globals)) {
    return new Globals(inputTree, options);
  }
  this.inputTree = inputTree;
  this.outputPrefix = 'ember-table';
  // Generates global objects for files in these folders
  this.topLevels = [
    'components',
    'controllers',
    'mixins',
    'models',
    'views'
  ];

  // FIXME(azirbel): Generate template names automatically instead, since
  // they have to be the same after all
  this.templateNameMapping = {
    'ember-table/templates/body-table-container': 'body-table-container',
    'ember-table/templates/components/ember-table': 'components/ember-table',
    'ember-table/templates/footer-table-container': 'footer-table-container',
    'ember-table/templates/header-cell': 'header-cell',
    'ember-table/templates/header-row': 'header-row',
    'ember-table/templates/header-table-container': 'header-table-container',
    'ember-table/templates/table-cell': 'table-cell',
    'ember-table/templates/table-row': 'table-row',
    'ember-table/templates/scroll-container': 'scroll-container'
  };

  // The old global names aren't consistent: some are on Ember.Table, some on
  // Ember.AddeparMixins, and some just on Ember. For backwards-compatibility
  // we need to maintain the same old names.
  this.globalNameMapping = {
    'ember-table/components/ember-table': 'Ember.Table.EmberTableComponent',
    'ember-table/controllers/row-array': 'Ember.Table.RowArrayController',
    'ember-table/controllers/row': 'Ember.Table.Row',
    'ember-table/mixins/mouse-wheel-handler': 'Ember.MouseWheelHandlerMixin',
    'ember-table/mixins/register-table-component': 'Ember.Table.RegisterTableComponentMixin',
    'ember-table/mixins/resize-handler': 'Ember.AddeparMixins.ResizeHandlerMixin',
    'ember-table/mixins/scroll-handler': 'Ember.ScrollHandlerMixin',
    'ember-table/mixins/show-horizontal-scroll': 'Ember.Table.ShowHorizontalScrollMixin',
    'ember-table/mixins/style-bindings': 'Ember.AddeparMixins.StyleBindingsMixin',
    'ember-table/mixins/touch-move-handler': 'Ember.TouchMoveHandlerMixin',
    'ember-table/models/column-definition': 'Ember.Table.ColumnDefinition',
    'ember-table/views/body-table-container': 'Ember.Table.BodyTableContainer',
    'ember-table/views/column-sortable-indicator': 'Ember.Table.ColumnSortableIndicator',
    'ember-table/views/footer-table-container': 'Ember.Table.FooterTableContainer',
    'ember-table/views/header-block': 'Ember.Table.HeaderBlock',
    'ember-table/views/header-cell': 'Ember.Table.HeaderCell',
    'ember-table/views/header-row': 'Ember.Table.HeaderRow',
    'ember-table/views/header-table-container': 'Ember.Table.HeaderTableContainer',
    'ember-table/views/lazy-container-view': 'Ember.LazyContainerView',
    'ember-table/views/lazy-item-view': 'Ember.LazyItemView',
    'ember-table/views/lazy-table-block': 'Ember.Table.LazyTableBlock',
    'ember-table/views/multi-item-collection': 'Ember.MultiItemCollectionView',
    'ember-table/views/scroll-container': 'Ember.Table.ScrollContainer',
    'ember-table/views/scroll-panel': 'Ember.Table.ScrollPanel',
    'ember-table/views/table-block': 'Ember.Table.TableBlock',
    'ember-table/views/table-cell': 'Ember.Table.TableCell',
    'ember-table/views/table-container': 'Ember.Table.TableContainer',
    'ember-table/views/table-row': 'Ember.Table.TableRow'
  };
};

Globals.prototype = Object.create(Writer.prototype);
Globals.prototype.constructor = Globals;

// FIXME(azirbel): Use trees only to check consistency with global mappings
Globals.prototype.write = function(readTree, destDir) {
  var _this = this;

  this.capitalize = function(s) {
    return s[0].toUpperCase() + s.substring(1);
  };

  return new Promise(function(resolve) {
    readTree(_this.inputTree).then(function(srcDir) {
      // // Get a listing of all js files from inputTree
      // var files = walk(srcDir).filter(function(f) {
      //   return /\.js$/.test(f);
      // });

      // var modules = [];
      // var dependencies = [];
      // var objectNames = [];
      // files.forEach(function(filename) {
      //   var parts = filename.split(path.sep);

      //   // Ignore any files not in topLevelModules
      //   if (_this.topLevels.indexOf(parts[0]) === -1) {
      //     return;
      //   }

      //   // the file name minus extension, or, the thing that should
      //   // be listed as a module name
      //   var module = [_this.outputPrefix]
      //     .concat(parts)
      //     .join(path.sep)
      //     .replace(path.extname(filename), ''); // TODO: Could improve

      //   modules.push("'" + module + "'");
      //   dependencies.push('__dependency' + (dependencies.length+1) + '__');

      //   var globalName = _this.globalNameMapping[module];
      //   if (!globalName) {
      //     console.log('ERROR: No global name found for ' + module + '.' +
      //         ' Please add one to globals > globalNameMapping.');
      //     throw('');  // TODO(azirbel): How to do this properly?
      //   }

      //   objectNames.push(globalName);
      // });
      // FIXME(azirbel): Log ember version and register with Ember.libraries?
      var output = [
        "define('ember', ['exports'], function(__exports__) {",
        "  __exports__['default'] = window.Ember;",
        "});",
        "",
        "window.Ember.Table = Ember.Namespace.create();",
        "window.Ember.AddeparMixins = {};"];
      var toRegister = [];
      // Define templates on Ember.TEMPLATES
      for (key in _this.templateNameMapping) {
        if (!_this.templateNameMapping.hasOwnProperty(key)) {
          continue;
        }
        output.push("window.Ember.TEMPLATES['" +
                    _this.templateNameMapping[key] + "']" +
                    " = require('" + key + "')['default'];");
      }
      // Define globals and register on the container
      for (key in _this.globalNameMapping) {
        if (!_this.globalNameMapping.hasOwnProperty(key)) {
          continue;
        }
        // Define the global
        output.push("window." + _this.globalNameMapping[key] +
                    " = require('" + key + "')['default'];");
        // Register on the container
        var type = key.split('/')[1].replace(/s$/, '')
        if (type === 'view' || type === 'component') {
          toRegister.push({
            type: type,
            moduleName: key,
            containerName: key.split('/')[2]
          });
        }
      }

      [
        "Ember.onLoad('Ember.Application', function(Application) {",
          "Application.initializer({",
            "name: 'ember-table',",
            "initialize: function(container) {"
      ].forEach(function(line) {
        output.push(line);
      });

      toRegister.forEach(function(item) {
        output.push("container.register('" +
            item.type + ':' + item.containerName +
            "', require('" + item.moduleName +
            "')['default']);" );
      });

      [
            "}",
          "});",
        "});"
      ].forEach(function(line) {
        output.push(line);
      });

      output.push("Ember.Handlebars.helper('table-component', " +
                  "Ember.Table.EmberTableComponent);");
      fs.writeFileSync(path.join(destDir, 'globals-output.js'), output.join("\n"));
      resolve();
    });
  });
};

module.exports = Globals;
