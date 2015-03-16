module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function(options) {
    // We assume that handlebars, ember, and jquery already exist
    // FIXME(azirbel): Do we need to install lodash too?
    return this.addBowerPackagesToProject([
      {
        'name': 'git@github.com:azirbel/antiscroll.git#90391fb371c7be769bc32e7287c5271981428356'
      },
      {
        'name': 'jquery-mousewheel',
        'target': '~3.1.4'
      },
      {
        'name': 'jquery-ui',
        // FIXME(azirbel): Can we use a newer version?
        'target': '1.10.1'
      }
    ]);
  }
};
