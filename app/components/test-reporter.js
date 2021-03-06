import Ember from 'ember';

export default Ember.Component.extend({
  currentLayout: 'left-right',
  classNameBindings: ['currentLayout'],
  passed: 0,
  failed: 0,
  total: 0,
  elapsed: 0,
  isRunning: false,
  currentTest: null,
  actions: {
    selectCurrentLayout: function(layout){
      this.set('currentLayout', layout);
    }
  },
  modules: [],
  testRunnerUrl: Ember.computed('test', function(){
    let url = "/tests";
    let params = {};
    if(this.get('test')){
      params.testId = this.get('test')
    }
    let paramStr = Ember.$.param(params);
    if(paramStr){
      url += '/?' + paramStr;
    }
    return url;
  }),
  failedModules: Ember.computed.filterBy('modules', 'failed'),
  passedOrNotRunModules: Ember.computed('modules.@each.failed', function(){
    return this.get('modules').filter(function(mod){
      return mod.get('failed') == undefined || mod.get('failed') === 0;
    }).sortBy('title');
  }),
  testRunBegin: function(details){
    this.set('total', details.totalTests);
    this.set('isRunning', true);
    let moduleData = [];
    details.modules.forEach(function(mod){
      let moduleId = generateHash(mod.name);
      let existingModule = moduleData.findBy('moduleId', moduleId);
      if(existingModule){
        mod.tests.forEach(function(test){
          existingModule.get('tests').pushObject(Ember.Object.create({
            title: test.name,
            testId: test.testId,
            assertions: []
          }));
        });
      }
      else {
        let newModule = Ember.Object.create({
          title: mod.name,
          moduleId: moduleId,
          tests: []
        });
        mod.tests.forEach(function(test){
          newModule.get('tests').pushObject(Ember.Object.create({
            title: test.name,
            testId: test.testId,
            assertions: []
          }));
        });
        moduleData.pushObject(newModule);
      }
    });
    this.set('modules', moduleData);
  },
  testRunComplete: function(details){
    this.set('isRunning', false);
  },
  moduleRunComplete: function(moduleData){
    let moduleId = generateHash(moduleData.name);
    let mod = this.get('modules').findBy('moduleId', moduleId);
    this.set('currenTest', null);
    mod.setProperties({
      runtime: moduleData.runtime,
      failed: moduleData.failed,
      passed: moduleData.passed,
      hasRun: true,
      running: false
    });
  },
  moduleRunBegin: function(moduleData){
    let moduleId = generateHash(moduleData.name);
    let mod = this.get('modules').findBy('moduleId', moduleId);
    mod.set('running', true);
  },
  testStart: function(testData){
    this.set('currentTest', {
      moduleName: testData.module,
      title: testData.name,
      testId: testData.testId
    });
  },
  testLog: function(assertionData){
    let mod = this.get('modules').findBy('moduleId', generateHash(assertionData.module));
    let test = mod.get('tests').findBy('testId', assertionData.testId);
    this.incrementProperty('elapsed', assertionData.runtime);
    test.get('assertions').pushObject(Ember.Object.create({
      result: assertionData.result,
      runtime: assertionData.runtime,
      message: assertionData.message || (assertionData.result ? 'okay' : 'failed'),
      actual: assertionData.actual,
      expected: assertionData.expected,
      source: assertionData.source,
      negative: assertionData.negative
    }));
    if(!assertionData.result){
      mod.incrementProperty('failed');
      test.incrementProperty('failed');
    }
  },
  testDone: function(testData){
    let mod = this.get('modules').findBy('moduleId', generateHash(testData.module));
    let test = mod.get('tests').findBy('testId', testData.testId);
    if(testData.failed === 0){
      this.incrementProperty('passed');
    }
    else {
      this.incrementProperty('failed');
    }
    test.setProperties({
      duration: testData.duration,
      failed: testData.failed,
      passed: testData.passed,
      skipped: testData.skipped,
      total: testData.total
    });
  },
  didInsertElement: function(){
    let component = this;
    Ember.$(document).on('qunit-begin', function(event, details){
      window.QUnit = Ember.$('.tests-window')[0].contentWindow.QUnit;
      Ember.run(() => component.testRunBegin(details));
    });
    Ember.$(document).on('qunit-done', function(event, details){
      Ember.run(() => component.testRunComplete(details));
    });
    Ember.$(document).on('module-start', function(event, details){
      Ember.run(() => component.moduleRunBegin(details));
    });
    Ember.$(document).on('module-done', function(event, details){
      Ember.run(() => component.moduleRunComplete(details));
    });
    Ember.$(document).on('test-start', function(event, details){
      Ember.run(() => component.testStart(details));
    });
    Ember.$(document).on('test-log', function(event, details){
      Ember.run(() => component.testLog(details));
    });
    Ember.$(document).on('test-done', function(event, details){
      Ember.run(() => component.testDone(details));
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
