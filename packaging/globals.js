var Writer = require('broccoli-writer');
var fs = require('fs');
var path = require('path');
var Promise = require('RSVP').Promise;
var walk = require('walk-sync');

var Globals = function (inputTree) {
  options = {};
  // FIXME(azirbel): What does this do?
  if (!(this instanceof Globals)) {
    return new Globals(inputTree, options);
  }
  this.inputTree = inputTree;
  this.outputPrefix = 'app';
  // Generates global objects for files in these folders
  this.topLevels = [
    'components',
    'controllers',
    'mixins',
    'models',
    'views'
  ];

  this.globalNameMapping = {
    'app/components/ember-table': 'Ember.Table.EmberTableComponent',
    'app/controllers/row-array': 'Ember.Table.RowArrayController',
    'app/controllers/row': 'Ember.Table.Row',
    'app/mixins/mouse-wheel-handler': 'Ember.MouseWheelHandlerMixin',
    'app/mixins/register-table-component': 'Ember.Table.RegisterTableComponentMixin',
    'app/mixins/resize-handler': 'Ember.AddeparMixins.ResizeHandlerMixin',
    'app/mixins/scroll-handler': 'Ember.ScrollHandlerMixin',
    'app/mixins/show-horizontal-scroll': 'Ember.Table.ShowHorizontalScrollMixin',
    'app/mixins/style-bindings': 'Ember.AddeparMixins.StyleBindingsMixin',
    'app/mixins/touch-move-handler': 'Ember.TouchMoveHandlerMixin',
    'app/models/column-definition': 'Ember.Table.ColumnDefinition',
    'app/views/body-table-container': 'Ember.Table.BodyTableContainer',
    'app/views/column-sortable-indicator': 'Ember.Table.ColumnSortableIndicator',
    'app/views/footer-table-container': 'Ember.Table.FooterTableContainer',
    'app/views/header-block': 'Ember.Table.HeaderBlock',
    'app/views/header-cell': 'Ember.Table.HeaderCell',
    'app/views/header-row': 'Ember.Table.HeaderRow',
    'app/views/header-table-container': 'Ember.Table.HeaderTableContainer',
    'app/views/lazy-container-view': 'Ember.LazyContainerView',
    'app/views/lazy-item-view': 'Ember.LazyItemView',
    'app/views/lazy-table-block': 'Ember.Table.LazyTableBlock',
    'app/views/multi-item-collection': 'Ember.MultiItemCollectionView',
    'app/views/scroll-container': 'Ember.Table.ScrollContainer',
    'app/views/scroll-panel': 'Ember.Table.ScrollPanel',
    'app/views/table-block': 'Ember.Table.TableBlock',
    'app/views/table-cell': 'Ember.Table.TableCell',
    'app/views/table-container': 'Ember.Table.TableContainer',
    'app/views/table-row': 'Ember.Table.TableRow'
  };
};

Globals.prototype = Object.create(Writer.prototype);
Globals.prototype.constructor = Globals;

Globals.prototype.write = function(readTree, destDir) {
  var _this = this;

  this.capitalize = function(s) {
    return s[0].toUpperCase() + s.substring(1);
  };

  return new Promise(function(resolve) {
    readTree(_this.inputTree).then(function(srcDir) {
      // Get a listing of all js files from inputTree
      var files = walk(srcDir).filter(function(f) {
        return /\.js$/.test(f);
      });

      /*
       * The general idea here is, for all files in the _this.topLevels dirs,
       * generate an AMD module that, when required, will export a global
       * object with the default export of that file named based on the
       * filename.
       *
       * TODO: see if some of the string manipulation here can be handled by
       * Ember? Assuming we can import it at this point. I'm not sure we can.
       */
      var modules = [];
      var dependencies = [];
      var objectNames = [];
      files.forEach(function(filename) {
        var parts = filename.split(path.sep);

        // Ignore any files not in topLevelModules
        if (_this.topLevels.indexOf(parts[0]) === -1) {
          return;
        }

        // the file name minus extension, or, the thing that should
        // be listed as a module name
        var module = [_this.outputPrefix]
          .concat(parts)
          .join(path.sep)
          .replace(path.extname(filename), ''); // TODO: Could improve

        modules.push("'" + module + "'");
        dependencies.push('__dependency' + (dependencies.length+1) + '__');

        var globalName = _this.globalNameMapping[module];
        if (!globalName) {
          console.log('ERROR: No global name found for ' + module + '.' +
              ' Please add one to globals > globalNameMapping.');
          throw('');  // TODO(azirbel): How to do this properly?
        }

        objectNames.push(globalName);
      });
      // build the actual amd module
      var output = ["define('globals', [" + modules.join(",\n") +
          ", \"exports\"], function(" + dependencies.join(",\n") +
          ", __exports__) {"];
      objectNames.forEach(function(objectName, i) {
        output.push("window." + objectName + " = " + dependencies[i] +
            "['default'];");
      });
      // FIXME(azirbel): Not sure if this will work
      output.push("__exports__['default'] = window.Ember.Table;");
      output.push("});");
      console.log(destDir);
      fs.writeFileSync(path.join(destDir, 'globals-output.js'), output.join("\n"));
      resolve();
    });
  });
};

module.exports = Globals;
