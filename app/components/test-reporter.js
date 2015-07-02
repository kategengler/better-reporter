import Ember from 'ember';

export default Ember.Component.extend({
  currentLayout: 'left-right',
  classNameBindings: ['currentLayout'],
  passed: 0,
  failed: 0,
  total: 0,
  elapsed: '0ms',
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
  ],
  testRunBegin: function(details){
    this.set('total', details.totalTests);

    let moduleData = [];
    details.modules.forEach(function(mod){
      let moduleId = generateHash(mod.name);
      let existingModule = moduleData.findBy('moduleId', moduleId);
      if(existingModule){
        mod.tests.forEach(function(test){
          existingModule.tests.push({
            title: test.name,
            testId: test.testId
          });
        });
      }
      else {
        let newModule = {
          title: mod.name,
          moduleId: moduleId,
          count: mod.tests.length,
          tests: []
        };
        mod.tests.forEach(function(test){
          newModule.tests.push({
            title: test.name,
            testId: test.testId
          });
        });
        moduleData.push(newModule);
      }
    });
    this.set('modules', moduleData);
  },
  didInsertElement: function(){
    let component = this;
    Ember.$(document).on('qunit-begin', function(event, details){
      Ember.run(() => component.testRunBegin(details));
    });
  }
});

function generateHash( name ) {
  var hex,
      i = 0,
      hash = 0,
      str = name + "\x1C",
      len = str.length;

  for ( ; i < len; i++ ) {
    hash  = ( ( hash << 5 ) - hash ) + str.charCodeAt( i );
    hash |= 0;
  }

  // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  // strictly necessary but increases user understanding that the id is a SHA-like hash
  hex = ( 0x100000000 + hash ).toString( 16 );
  if ( hex.length < 8 ) {
    hex = "0000000" + hex;
  }

  return hex.slice( -8 );
}
