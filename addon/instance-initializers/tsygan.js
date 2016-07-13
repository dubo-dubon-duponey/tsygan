const { computed } = Ember;

export function initialize(application) {
  console.debug('com.tsygan::instance-initializer::tsygan <<');
  var store = application.lookup('service:store');
  var modelFactory = application.lookup('service:tsygan@model-factory');

  // Register all schema that exist at this point (system schemas and the possible result of early fetch
  // from known backend from app initializer)
  store.peekAll('tsygan@spacedog-schema').forEach(function(schema){
    modelFactory.register(schema);
  });

  // XXX Dirty hack for now
  // The reason is that share ids are mashed-up with the filename, for terribly bad reasons
  // We thus expose a "short" property, to get that back
  application.resolveRegistration('model:tsygan@spacedog-share').reopen({
    short: computed('id', function(){
      return (this.get('id') || '').split('*').shift();
    })
  });

  console.debug('com.tsygan::instance-initializer::tsygan >> done registering all known schema records as models');
}

export default {
  name: 'tsygan',
  initialize
};
