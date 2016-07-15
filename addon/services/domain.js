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

  // Pending operations
  pending: false,

  // Contain the possible error retrieving schemas
  error: false,

  // Dependency on the store, to retrieve schema records
  store: Ember.inject.service('store'),

  // On domain change, remove all backend specific schemas
  // This takes care of domain swapping
  // This does NOT take care of dynamic model modification / destruction
  // This leaves the systems schemas alone
  domainChangeObserver: observer('domain', function(){
    // If we previously were in a ready state, purge everything with fire
    if (this.get('ready', true)){
      // Unregister any schema based model
      this.get('store').peekAll('tsygan@spacedog-schema').forEach(function(schema){
        this.unregister(schema);
      }, this);

      // Remove everything in the store - can't take the risk of leaking data from one backend to the other
      this.get('store').unloadAll();

      // Reset
      this.set('ready', false);
    }

    this.set('error', false);
    this.set('pending', false);

    // Boot now, if domain is not empty - will trigger a full schema list download
    if (this.get('domain')) {
      this.set('pending', true);
      this.get('store').findAll('tsygan@spacedog-schema').then(function(){
        this.set('pending', false);
        this.set('ready', true);
        // Dirty hack to call insert again system schemas
        var registry = Ember.getOwner(this);
        registry.resolveRegistration('instance-initializer:tsygan@model-log').initialize(registry);
        registry.resolveRegistration('instance-initializer:tsygan@model-share').initialize(registry);
        registry.resolveRegistration('instance-initializer:tsygan@model-user').initialize(registry);
        registry.resolveRegistration('instance-initializer:tsygan@tsygan').initialize(registry);
      }.bind(this), function(){
        this.set('pending', false);
        this.set('error', 'Failed retrieving schemas from the backend! Does the backend exist?');
      }.bind(this));}
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
