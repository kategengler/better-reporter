import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'better-reporter/tests/helpers/start-app';

var application;

module('Acceptance | index', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /index', function(assert) {
  visit('/index');

  andThen(function() {
    return pauseTest();
    assert.equal(currentURL(), '/index');
  });
});
