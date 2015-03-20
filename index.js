'use strict';

module.exports = {
  name: 'ember-table',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/antiscroll/antiscroll.js');
    app.import(app.bowerDirectory + '/antiscroll/antiscroll.css');
    app.import(app.bowerDirectory + '/jquery-ui/ui/jquery-ui.custom.js');
    app.import(app.bowerDirectory + '/jquery-mousewheel/jquery.mousewheel.js');

    // FIXME(azirbel): Need to import ember table CSS
  },

  setupPreprocessorRegistry: function(type, registry) {
    var tool = 'ember-cli-less';
    console.log('setupPreprocessorRegistry using ' + tool);
    // Also not working
    // registry.add('css', 'broccoli-less', ['less']);
    registry.add('css', {
      name: tool,
      ext: 'less',
      toTree: function(tree) { return tree; }
    });
  },

  afterInstall: function() {
    this.addBowerPackageToProject('antiscroll');
    this.addBowerPackageToProject('jquery-mousewheel');
    this.addBowerPackageToProject('jquery-ui');
  }
};
