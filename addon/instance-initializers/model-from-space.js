export function initialize(application) {
  console.debug('com.tsygan::instance-initializer: create records from the retrieved payload from app creation');
  var store = application.lookup('service:store');

  // Register all existing models (from the retrieved payload queried during app instanciation)
  var conf = application.resolveRegistration('config:environment');
  store.pushPayload(conf.APP.SPACEDOG_SCHEMATICS);
}

export default {
  name: 'model-from-space',
  before: 'model-user',
  initialize
};
