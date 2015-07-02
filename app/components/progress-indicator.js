import Ember from 'ember';

export default Ember.Component.extend({
  percentage: Ember.computed('passed', 'failed', 'total', function(){
    return ((this.get('passed') + this.get('failed')) / this.get('total')) * 100;
  })
});
