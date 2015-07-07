import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isExpanded: false,
  failedTests: Ember.computed.filterBy('mod.tests', 'failed'),
  passedOrNotRunTests: Ember.computed('mod.tests.@each.failed', function(){
    return this.get('mod.tests').filter(function(test){
      return test.get('failed') == undefined || test.get('failed') === 0;
    });
  }),
  actions: {
    toggleExpand: function(){
      this.toggleProperty('isExpanded');
    }
  }
});
