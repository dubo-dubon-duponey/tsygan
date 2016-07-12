// This is a convenience speed-up
export function initialize(application) {
  console.debug('com.tsygan::instance-initializer::model-from-space <<');
  var store = application.lookup('service:store');

  // This is just a convenient way to speed-up instanciation by preloading a spacedog schemas payload when the backend is known
  var conf = application.resolveRegistration('config:environment');
  if (conf.APP.SPACEDOG_SCHEMATICS){
    console.debug('com.tsygan::instance-initializer::model-from-space >> inserting early payload');
    return store.pushPayload(conf.APP.SPACEDOG_SCHEMATICS);
  }
  console.debug('com.tsygan::instance-initializer::model-from-space >> nothing to do');
}

export default {
  name: 'model-from-space',
  before: 'model-user',
  initialize
};
