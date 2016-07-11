export function initialize(application) {
  console.debug('com.tsygan::instance-initializer: register existing models and creating logs & share models');
  var store = application.lookup('service:store');
  var modelFactory = application.lookup('service:model-factory');

  // Register all existing models from the schema records
  store.peekAll('tsygan@spacedog-schema').forEach(function(schema){
    modelFactory.register(schema);
  });
}

export default {
  name: 'spacedog',
  initialize
};
