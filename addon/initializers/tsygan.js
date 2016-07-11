/* global SpaceDog:false */
export function initialize(application) {
  application.deferReadiness();

  var conf = application.resolveRegistration('config:environment');

  // The purpose of this is to get the list of already saved schemas from SpaceDog, and block until it completes
  // Unfortunately, we can't register the schemas directly (because the store is not yet there)
  // And we can't query the service and block until it answers in instance init.
  // So, we fetch here, store the payload in config, then synchronously register the models in the instance initializer
  SpaceDog.boot(conf.APP.SPACEDOG_BACKEND, function(data){
    conf.APP.SPACEDOG_SCHEMATICS = SpaceDog.normalize.schema.get(JSON.parse(data), '');
    application.advanceReadiness();
  });
}

export default {
  name: 'tsygan',
  initialize
};
