import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isExpanded: false,
  actions: {
    toggleExpand: function(){
      this.toggleProperty('isExpanded');
    }
  }
});
