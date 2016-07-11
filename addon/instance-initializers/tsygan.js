export function initialize(application) {
  console.debug('com.tsygan::tsygan-initializer <<');
  var store = application.lookup('service:store');
  var modelFactory = application.lookup('service:model-factory');

  // Register all schema that exist at this point (system schemas and the possible result of early fetch
  // from known backend from app initializer)
  store.peekAll('tsygan@spacedog-schema').forEach(function(schema){
    // if(schema.get('id').startsWith('tsygan@'))
    modelFactory.register(schema);
  });
  console.debug('com.tsygan::tsygan-initializer >> done registering all known schema records');
}

export default {
  name: 'tsygan',
  initialize
};
