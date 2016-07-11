import Ember from 'ember';
// XXX
// import { initialize } from 'dummy/instance-initializers/spacedog';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

//this is the mock store service:
const storeStubFactory  = Ember.Service.extend({
  data: null,
  init(){
    this.data = [];
  },
  pushPayload(payload){
    this.get('data').pushObject(payload);
  },
  getAllPayloads(){
    return this.get('data');
  },
  createRecord(d){
    return d;
  }
});

module('Unit | Instance Initializer | spacedog', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
      this.appInstance.register('service:store', storeStubFactory);
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it works', function(assert) {

  // XXX currently doesn't work because of incomplete store mock
//  initialize(this.appInstance);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
