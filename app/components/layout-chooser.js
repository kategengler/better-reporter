import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  actions: {
    select: function(name){
      this.attrs.selectCurrentLayout(name);
    }
  }
});
