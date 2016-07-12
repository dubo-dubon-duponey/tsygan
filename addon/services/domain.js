import Ember from 'ember';
import ModelFactory from './model-factory';
const { observer } = Ember;

export default ModelFactory.extend({

  // Backend to use - careful NOT TO double-way bind to this, since changes will trigger a model reset and lookup
  // If you have a back-office, just set this to the final value you want to test against
  domain: '',

  // Denote that we have received schemas from the backend, with no error - observe this to decide whether
  // the app is ready or not
  ready: false,

  // Contain the possible error retrieving schemas
  error: false,

  // Dependency on the store, to retrieve schema records
  store: Ember.inject.service('store'),

  // On domain change, remove all backend specific schemas
  // This takes care of domain swapping
  // This does NOT take care of dynamic model modification / destruction
  // This leaves the systems schemas alone
  domainChangeObserver: observer('domain', function(){
    // Reset
    this.set('ready', false);
    this.set('error', false);

    // Remove any backend defined model, and delete the schemas from the store
    this.get('store').peekAll('tsygan@spacedog-schema').forEach(function(schema){
      if (!schema.get('id').startsWith('tsygan@')){
        this.unregister(schema);
        this.get('store').unloadRecord(schema);
      }
    }, this);

    // Boot again now - will trigger a full schema list download
    if (this.get('domain'))
      this.get('store').findAll('tsygan@spacedog-schema').then(function(){
        this.set('ready', true);
        // Register all backend models now
        this.get('store').peekAll('tsygan@spacedog-schema').forEach(function(schema){
          if (!schema.get('id').startsWith('tsygan@'))
            this.register(schema);
        }, this);
        // Dirty hack to call again user schema overload
        Ember.getOwner(this).resolveRegistration('instance-initializer:tsygan@model-user').
        initialize(Ember.getOwner(this));
      }.bind(this), function(){
        this.set('error', 'Failed retrieving schemas from the backend! Does the backend exist?');
      }.bind(this));
  }),

  init: function(){
    /* eslint no-underscore-dangle:0 */
    console.warn('com.tsygan::service::domain <<');
    this._super(...arguments);

    // Investigate config and check what's in there
    var conf = Ember.getOwner(this).resolveRegistration('config:environment');
    // Nothing? tag along
    if (!conf.APP.SPACEDOG_BACKEND)
      return;
    // We have a domain, meaning we had early registration of models already, so go for it, mark it fine.
    this.set('domain', conf.APP.SPACEDOG_BACKEND);
    this.set('ready', true);
  }

});
