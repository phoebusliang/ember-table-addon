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

  /*
   * Replace patterns. We use this to replace strings such as:
   * @@{controllers/file.js}
   * With the content of those files.
   */
  replace: {
    files: [
      '**/*'
    ],
    patterns: [{
      match: /@@{[^}]*}/,
      replacement: function(matchedText) {
        filename = matchedText.slice(3, -1);
        fullFilename = './tests/dummy/app/' + filename;
        fileContents = fs.readFileSync(fullFilename, 'utf8');
        return fileContents.replace(/\n/g, '\\n');
      }
    }]
  }
});

app.import(app.bowerDirectory + '/d3/d3.js');

module.exports = app.toTree();
