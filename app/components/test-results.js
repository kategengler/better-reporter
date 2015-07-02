import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  isExpanded: false,
  actions: {
    toggleExpand: function(){
      this.toggleProperty('isExpanded');
    }
  }
});
