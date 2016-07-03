/* global SpaceDog:false */
import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

var abuseRouting = function(options){
  // Depluralize all leading endpoints
  options.url = options.url.replace(/^(\/[^\/]+)(s)($|\/)/, '$1$3');

  // Be sure we have headers
  options.headers = options.headers || {};

  // Now, vary on the first segment path (can be 'spacedog-endpoint')
  var root = options.url.split('/');
  root.shift();
  var secondary = root.shift().split('-');
  root = secondary.shift();

  switch(root){
    // Endpoints prefixed with spacedog- are used as a trick to reforward to a non-data endpoint
    case 'tsygan@spacedog':
      // Remove the trick prefix
      options.url = options.url.replace(/^\/(?:tsygan@)?spacedog-([^/]+)/, '/$1');
      // Get the actual endpoint
      switch(secondary.shift()){
        case 'share':
          switch(options.type) {
            // Share creation gymnastic
            case 'POST':
              // Add the filename to the url
              options.url += '/' + options.data.data.attributes.filename;
              // Pass up the content-type for the file
              options.headers['Content-type'] = options.data.data.attributes['content-type'];
              // Prevent jquery from mangling the binary payload
              options.processData = false;
              break;
            case 'DELETE':
              // We use id*filename as internal ids
              // Replace * with a / to turn it back into actionable delete
              options.url = options.url.replace(/([/][^/*]+)([*])/, "$1/");
              break;
          }
          break;
        case 'schema':
          switch(options.type){
            case 'POST':
              // Creation as an update
              options.url += '/' + options.data.data.id;
              break;
          }
          break;
        case 'schemafield':
          switch(options.type){
            case 'DELETE':
              console.warn('gonna fake it');
              options.fakeIt = true;
              break;
          }
          break;

      }
      break;

    default:
      console.warn('THAT MUST BE DATA');
      break;
  }

  // Change methods to accomodate SpaceDog oddities
  switch(options.type){
    // Record modification uses PUT instead of PATCH
    case 'PATCH':
      options.type = 'PUT';
      break;
    // Schema and share creation use PUT instead of POST
    case 'POST':
      options.type = 'PUT';
      break;
  }

};


export default JSONAPIAdapter.extend({
  kevinspacey: Ember.inject.service('tsygan@spacedog'),

  _ajaxRequest: function(options) {
    // Hijack the error handler to be able to send an alert on the data store
    var originalOnError = options.error;
    options.error = function (jqXHR, textStatus, errorThrown) {
      // Continue with the downstream error handler
      originalOnError.apply(options, [jqXHR, textStatus, errorThrown]);
      // XXX no model in here yet for that
      Ember.getOwner(this).lookup('service:store').createRecord('alert', {
        type: 'danger',
        title: 'SpaceDog service erroring out!',
        message: 'Status: ' + (textStatus || 'NOTHING!') + ' - ErrorThrown: ' + (errorThrown || 'Service is tits-up with no specific error thrown!'),
        destruct: 0
      });

      Ember.getOwner(this).lookup('service:store').createRecord('alert', {
        type: 'warning',
        title: 'Failed on:',
        message: options.url,
        destruct: 0
      });
    }.bind(this);

    // Hijack success callbacks to proceed with deserialization & transmogrification
    var defer = options.success;
    options.success = function (payload, textStatus, jqXHR) {
      // On success, denormalize first before passing the bucket
      payload = SpaceDog.normalize(options.url, options.type, jqXHR.responseText);
      defer.apply(options, [payload, textStatus, jqXHR]);
    };

    // Reopen data silently
    try{
      options.data = JSON.parse(options.data);
    }catch(e){
    }

    // Translate JSONAPI calls to SpaceDog inhouse routing transparently
    abuseRouting(options);

    // Serialize payload if there is one
    SpaceDog.serialize(options);

    // XXX SpaceDog Workaround https://github.com/spacedog-io/services/issues/28
    var wk = options.url.split('?');
    wk[0] = wk[0].replace(/([\/]{2,})/g, '/');
    options.url = wk.join('?');

    // Map to the final url
    options.url = 'https://' + this.get('kevinspacey.domain') + '.spacedog.io/1' + options.url;
    // Cram in authentication
    options.headers.Authorization = 'Basic ' + this.get('kevinspacey.authorization');

    options.headers['x-spacedog-debug']= this.get('kevinspacey.debug');


    // "Fake" operations will send an event later with fake payload
    if (options.fakeIt)
      return setTimeout(options.success, 1,
        undefined, 200, {
          status: 200,
          responseText: '{"data": {"id": "' + decodeURIComponent(options.url.split('/').pop()) + '", "type": "tsygan@spacedog-schemafield"}}',
          getAllResponseHeaders: function(){
            return 'Content-Type: application/json;charset=UTF-8';
          }
        });

    // Real operations then go in the usual Ember ajax infrastructure
    Ember.$.ajax(options);
  },

  // XXX the REST implementation forces stringification of the request body, regardless of what it is (doesn't work for files, obviously)
  // So, lie about it (and don't pay the perf penaly either) :)
  ajaxOptions(url, type, options) {
    var d;
    if(options){
      d = options.data;
      delete options.data;
    }
    var ret = this._super(...arguments);
    ret.data = d;
    return ret;
  },

  // Default id generator in case no id is specified
  generateIdForRecord: SpaceDog.uuid.generate
});
