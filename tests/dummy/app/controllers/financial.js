import Ember from 'ember';
import Treedata from '../models/treedata';

export default Ember.Controller.extend({
  data: function() {
    return Treedata;
  }.property()
});
