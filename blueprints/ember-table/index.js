module.exports = {
  description: 'Lazily loaded',
  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addBowerPackageToProject('ember-table');
  }
};
