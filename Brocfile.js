/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var fs = require('fs');

var app = new EmberAddon({
  lessOptions: {
    paths: [
      'tests/dummy/app/styles/'
    ],
    outputFile: 'dummy.css'
  },

  // Replace patterns starting with @@
  replace: {
    files: [
      '**/*'
    ],
    patterns: [{
      match: /@@{(foo)}/,
      replacement: 'Bam $1 Bam'
    }]
  }
});

app.import(app.bowerDirectory + '/d3/d3.js');

module.exports = app.toTree();
