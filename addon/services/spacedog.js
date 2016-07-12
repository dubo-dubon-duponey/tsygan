import Ember from 'ember';
const { computed, observer } = Ember;

export default Ember.Service.extend({
  // Don't double bind on this - changing these will trigger a login
  user: '',
  password: '',
  verified: false,
  error: false,
  pending: false,

  debug: false,

  store: Ember.inject.service('store'),

  domain: Ember.inject.service('tsygan@domain'),

  // Changes on these means logout
  domainChangeObserver: observer('domain.domain', 'domain.ready', function(){
    this.logout();
  }),

  // Changing any of these will reset any error, and stop any pending login attempt
  // This will NOT trigger at init time
  credentialsChangeObserver: observer('user', 'password', 'domain.domain', 'domain.ready', function(){
    console.warn('com.tsygan::service::spacedog observing changes',
      this.get('user', this.get('password'), this.get('domain.ready')));
    this.set('verified', false);
    this.set('error', false);
    // Cancel a possibly previously running login
    if (this.get('pending')){
      this.get('pending').abort();
      this.set('pending', false);
    }
    if (!this.get('user') || !this.get('password') || !this.get('domain.ready') || !this.get('domain.domain'))
      return;

    // Login if we can
    this.login();
  }),

  init: function(){
    /* eslint no-underscore-dangle:0 */
    console.warn('com.tsygan::service::spacedog <<');
    this._super(...arguments);

    // Investigate config and check what's in there
    var conf = Ember.getOwner(this).resolveRegistration('config:environment');
    this.set('debug', conf.APP.SPACEDOG_DEBUG);

    // Just make sure we kick this - barely observing it will not be enough
    this.get('domain.ready');

    if (!conf.APP.SPACEDOG_USER)
      return;
    this.set('user', conf.APP.SPACEDOG_USER);
    this.set('password', conf.APP.SPACEDOG_PASSWORD);
    this.set('verified', true);
  },

  logout: function(){
    console.warn('com.tsygan::service::spacedog logout');
    this.set('user', '');
    this.set('password', '');
  },

  login: function(){
    console.warn('com.tsygan::service::spacedog attempt at login');
    var xhr = this.set('pending', new XMLHttpRequest());
    xhr.onreadystatechange = function(/*event*/) {
      if (xhr.readyState !== 4)
        return;

      this.set('pending', false);
      if (xhr.status === 200)
        return this.set('verified', true);
      this.set('error', xhr.status);
    }.bind(this);

    xhr.open('GET', 'https://' + this.get('domain.domain') + '.spacedog.io/1/login', true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.get('user') + ':' + this.get('password')));
    xhr.send();
  },

  authorization: computed('verified', function(){
    if (this.get('verified'))
      return btoa(this.get('user') + ':' + this.get('password'));
  })

});
