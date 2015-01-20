/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var fs = require('fs');

// I know this is a hack, but it DOES work. I'll replace it later.
function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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
        // I'm going insane
        var matchedLength = matchedText.length;
        var cutLength = matchedLength - 4;

        // BUT If I do this, the console spits out major errors. It appears the
        // string has overflowed.
        var filename = matchedText.substr(3, cutLength);

        var fullFilename = './tests/dummy/app/' + filename;
        var fileContents = fs.readFileSync(fullFilename, 'utf8');

        // Incidentally, this also works
        //fileContents = fs.readFileSync('./tests/dummy/app/controllers/simple.js', 'utf8');

        return htmlEntities(fileContents).replace(/\n/g, '\\n');
      }
    }]
  }
});

app.import(app.bowerDirectory + '/d3/d3.js');

module.exports = app.toTree();
