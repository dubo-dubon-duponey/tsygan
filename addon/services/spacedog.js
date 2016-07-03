import Ember from 'ember';
const { computed } = Ember;

// import config from '../config/environment';

var SpaceDogLogin = window.SL = Ember.Service.extend({
  domain: '',
  user: '',
  password: '',
  // XXX they should reset everytime on the access values are changed
  verified: false,
  error: false,
  pending: false,
  debug: false,

  init: function(){
    this._super(...arguments);
    var conf = Ember.getOwner(this).resolveRegistration('config:environment');
    this.set('debug', conf.APP.SPACEDOG_DEBUG);
    if(!conf.APP.SPACEDOG_USER)
      return;
    this.set('domain', conf.APP.SPACEDOG_BACKEND);
    this.set('user', conf.APP.SPACEDOG_USER);
    this.set('password', conf.APP.SPACEDOG_PASSWORD);
    this.set('verified', true);
    /*computed('_', function() {
     return config.APP.SPACEDOG_BACKEND;
     }),*/
  },

  logout: function(){
    this.set('user', '');
    this.set('domain', '');
    this.set('password', '');
    this.set('verified', false);
    this.set('error', false);
    this.set('pending', false);
  },

  login: function(){
    this.set('verified', false);
    this.set('error', false);

    // Cancel a possibly previously running login
    if(this.get('pending'))
      this.get('pending').abort();

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

  authorization: computed('verified', function(){
    if(this.get('verified'))
      return btoa(this.get('user') + ':' + this.get('password'));
    return;
  })

  /*
  isServiceFactory: true,

  create: function(){
    return new jsBoot.services.SingleApp(config.APP.APP_KEY, config.APP.LOCK_TIME);
  }
*/

});

export default SpaceDogLogin;
