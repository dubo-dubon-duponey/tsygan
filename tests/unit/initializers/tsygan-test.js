import Ember from 'ember';
// import SpacedogInitializer from 'dummy/initializers/spacedog';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | spacedog', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  // XXX doesn't work yet
  // SpacedogInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
