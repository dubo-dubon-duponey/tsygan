export function initialize(application) {
  console.debug('com.tsygan::application-initializer <<');

  application.deferReadiness();

  var conf = application.resolveRegistration('config:environment');

  var booter = function(){
    SpaceDog.boot(conf.APP.SPACEDOG_BACKEND, function(data){
      try {
        conf.APP.SPACEDOG_SCHEMATICS = SpaceDog.normalize.schema.get(JSON.parse(data), '');
        application.advanceReadiness();
        console.debug('com.tsygan::application-initializer >> successfully retrieved early schemas payload');
      } catch (e) {
        // This would only happen if upstream returned a 200 with a broken JSON payload
        // (eg: broken proxy, or very broken SpaceDog instance)
        throw new SpaceDog.Error(SpaceDog.Error.WRONG_ARGUMENTS, 'SpaceDog schemas cant be parsed: ' + e + ' ' + data);
      }
    }, function(xhr){
      if (xhr.status === 0){
        setTimeout(booter, 5000);
        return console.warn('SpaceDog is not reachable. No internet? Will retry in 5 seconds');
      }
      // XXX https://github.com/spacedog-io/services/issues/52 makes it impossible to reach this condition for now
      throw new SpaceDog.Error(
        SpaceDog.Error.NATURAL_BORN_CRASH,
        'Failed to retrieve schemas from SpaceDog backend (' + conf.APP.SPACEDOG_BACKEND + ').\n\nError was: ' +
        xhr.status + '\n\npayload: ' + xhr.responseText);
    });
  };

  // The purpose of this is to get the list of already saved schemas from SpaceDog, and block until it completes
  // Unfortunately, we can't register the schemas directly (because the store is not yet there)
  // And we can't query the service and block until it answers in instance init.
  // So, we fetch here, store the payload in config, then synchronously register the models in the instance initializer
  if (conf.APP.SPACEDOG_BACKEND)
    return booter();
  console.debug('com.tsygan::application-initializer >> no pinned backend, moving on');
  application.advanceReadiness();
}

export default {
  name: 'tsygan',
  initialize
};
