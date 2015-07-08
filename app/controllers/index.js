import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['test', 'filter', 'modules'],
  test: null,
  filter: null,
  modules: null
});
