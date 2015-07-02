import Ember from 'ember';

export default Ember.Component.extend({
  currentLayout: 'left-right',
  classNameBindings: ['currentLayout'],
  actions: {
    selectCurrentLayout: function(layout){
      this.set('currentLayout', layout);
    }
  },
  modules: [
    {
      title: 'Acceptance: Index',
      count: 3,
      tests: [
        { title: 'It shows the app in an iframe', count: 2,
          assertions: [
            {text: 'iFrame should exist'},
            {text: 'App should be in that iframe'}
          ]
        }
      ]
    },
    {
      title: 'component/pagination',
      count: 4
    },
    {
      title: 'JSHint - .',
      count: 34
    }
  ]
});
