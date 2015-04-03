/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
// FIXME(azirbel): This is deprecated
var pickFiles = require('broccoli-static-compiler');
var compileES6 = require('broccoli-es6-concatenator');
var es3Safe = require('broccoli-es3-safe-recast');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var less = require('broccoli-less-single');
var registry = require('./registry');
var wrap = require('./wrap');
var globals = require('./globals');

// FIXME(azirbel): Remove
var instrument = require('broccoli-debug').instrument;

var addonTree = pickFiles('../addon', {
  srcDir: '/',
  destDir: 'addon'  // FIXME(azirbel): Why addon and not / ?
});
var viewsTree = pickFiles('../app/views', {
  srcDir: '/',
  destDir: 'addon/views'
});

// compile templates
var templateTree = templateCompiler('../addon/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'addon/templates'});

templateTree = instrument.print(templateTree);

var precompiled = mergeTrees([templateTree, viewsTree, addonTree], {overwrite: true});

precompiled = instrument.print(precompiled);

// Register components, controllers, etc. on the application container.
// Output goes to registry-output.js
// FIXME(azirbel): Do we need this?
// var registrations = registry(pickFiles(precompiled, {srcDir: '/addon', destDir: '/'}));

// Generate global exports for components, mixins, etc. Output goes
// into globals-output.js
var globalExports = globals(pickFiles(precompiled, {srcDir: '/addon', destDir: '/'}));

// globalExports = instrument.print(globalExports);

// Require.js module loader
var loader = pickFiles('../bower_components', {srcDir: '/loader.js', destDir: '/'});

// glue.js contains the code for the application initializer that requires the
// output from registry-output.js and the global statements that require
// globals.js
// var glue = new Funnel('.', {
//   include: [/^glue\.js$/]
// });

// Order matters here. glue needs to come after globalExports and registrations
// var jsTree = mergeTrees([
//   glue,
//   mergeTrees([precompiled, registrations, globalExports, loader])
// ]);
var jsTree = mergeTrees([precompiled, globalExports, loader]);

jsTree = instrument.print(jsTree);

// module.exports = jsTree;

// Transpile modules
var compiled = compileES6(jsTree, {
  wrapInEval: false,
  loaderFile: 'loader.js',
  inputFiles: ['addon/**/*.js'],
  ignoredModules: ['ember'],
  outputFile: '/js/ember-table.js',
  legacyFilesToAppend: ['globals-output.js']
  // legacyFilesToAppend: ['registry-output.js', 'globals-output.js', 'glue.js']
});
compiled = wrap(compiled);

// Compile LESS
var lessTree = pickFiles('../addon/styles', { srcDir: '/', destDir: '/' });
var lessMain = 'addon.less';
var lessOutput = 'css/ember-table.css';
lessTree = less(lessTree, lessMain, lessOutput);

module.exports = mergeTrees([es3Safe(compiled), lessTree]);
