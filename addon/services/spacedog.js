import Ember from 'ember';
const { computed, observer } = Ember;

export default Ember.Service.extend({
  domain: '',
  user: '',
  password: '',
  verified: false,
  error: false,
  pending: false,
  debug: false,

  store: Ember.inject.service('store'),
  schematics: [],

  // Changing any of these will reset any error, and stop any pending login attempt
  changeObserver: observer('domain', 'user', 'password', function(){
    this.set('verified', false);
    this.set('error', false);

    // Cancel a possibly previously running login
    if(this.get('pending')){
      this.get('pending').abort();
      this.set('pending', false);
    }

    // Remove any existing model that is user defined
    this.get('schematics');
  }),

  init: function(){
    this._super(...arguments);
    var conf = Ember.getOwner(this).resolveRegistration('config:environment');
    this.set('debug', conf.APP.SPACEDOG_DEBUG);
    if(!conf.APP.SPACEDOG_USER)
      return;
    // If we have a config, we trust it, even if that's very wrong
    this.set('domain', conf.APP.SPACEDOG_BACKEND);
    this.set('user', conf.APP.SPACEDOG_USER);
    this.set('password', conf.APP.SPACEDOG_PASSWORD);
    this.set('verified', true);
    // Launch a verification in the background
    this.login();

    // Attach the full list of schema records
    this.set('schematics', this.get('store').peekAll('tsygan@spacedog-schema'));
  },

  logout: function(){
    this.set('domain', '');
    this.set('user', '');
    this.set('password', '');
  },

  login: function(){
    var xhr = this.set('pending', new XMLHttpRequest());
    xhr.onreadystatechange = function(/*event*/) {
      if(xhr.readyState !== 4)
        return;

      this.set('pending', false);
      if (xhr.status === 200)
        return this.set('verified', true);
      this.set('error', xhr.status);
    }.bind(this);

    xhr.open('GET', 'https://' + this.get('domain') + '.spacedog.io/1/login', true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.get('user') + ':' + this.get('password')));
    xhr.send();
  },

  // internal method to retrieve schemas for a given backend
  boot: function(){

  },

  authorization: computed('verified', function(){
    if(this.get('verified'))
      return btoa(this.get('user') + ':' + this.get('password'));
    return;
  }),



  /*
  isServiceFactory: true,

  create: function(){
    return new jsBoot.services.SingleApp(config.APP.APP_KEY, config.APP.LOCK_TIME);
  }
*/

});
