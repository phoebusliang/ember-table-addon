import Ember from 'ember';

export default Ember.ArrayProxy.extend({
  createGithubEvent: function(row, event) {
    row.set('type', event.type);
    row.set('createdAt', event.created_at);
    row.set('login', event.actor.login);
    row.set('avatar', event.actor.avatar_url);
    return row.set('isLoaded', true);
  },
  requestGithubEvent: function(page) {
    var content, end, start, url, _results;
    content = this.get('content');
    start = (page - 1) * 30;
    end = start + 30;
    url = "https://api.github.com/repos/emberjs/ember.js/events?page=" + page + "&per_page=30&callback=?";
    Ember.$.getJSON(url, (function(_this) {
      return function(json) {
        return json.data.forEach(function(event, index) {
          var row;
          row = content[start + index];
          return _this.createGithubEvent(row, event);
        });
      };
    })(this));
    return (function() {
      _results = [];
      for (var _i = start; start <= end ? _i < end : _i > end; start <= end ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).forEach(function(index) {
      return content[index] = Ember.Object.create({
        eventId: index,
        isLoaded: false
      });
    });
  },
  objectAt: function(index) {
    var content, row;
    content = this.get('content');
    row = content[index];
    if (row && !row.get('error')) {
      return row;
    }
    this.requestGithubEvent(Math.floor(index / 30 + 1));
    return content[index];
  }
});
