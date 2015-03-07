module.exports = function (grunt) {
  'use strict';

  var path = require('path');

  grunt.loadNpmTasks('grunt-release-it');

  // FIXME(azirbel): Needs usebanner
  // FIXME(azirbel): Needs versioning support for new releases

  // Project configuration.
  grunt.initConfig({
    'release-it': {
      options: {
        'pkgFiles': ['package.json', 'bower.json'],
        'commitMessage': 'Release %s',
        'tagName': 'v%s',
        'tagAnnotation': 'Release %s',
        'increment': 'patch',
        'buildCommand': 'ember build --environment="production"',
        'distRepo': '-b gh-pages git@github.com:addepar/ember-table-addon',
        'distStageDir': '.stage',
        'distBase': 'dist',
        'distFiles': ['**/*'],
        'publish': false
      }
    }
  });
};

