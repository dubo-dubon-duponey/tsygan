/* global SpaceDog:false */
import Transform from 'ember-data/transform';

import Constants from 'tsygan/constants';
const { languages } = Constants;

// This is Elastic Search actual list of supported languages
// Keys represent what Spacedog will accept, values represent human displayed version
export default Transform.extend({
  deserialize: function (serialized, options) {
    serialized = serialized || languages[options.defaultValue];
    var ret;
    Object.keys(languages).some(function (key) {
      if (serialized === languages[key])
        return ret = key;
    });
    if (!ret)
      throw new SpaceDog.Error(SpaceDog.Error.WRONG_ARGUMENTS, 'Unhandled language from SpaceDog service! (' + serialized + ')');
    return ret;
  },

  serialize: function (deserialized, options) {
    deserialized = deserialized || options.defaultValue;
    if (!deserialized)
      return '';
    if (deserialized in languages)
      return languages[deserialized];
    throw new SpaceDog.Error(SpaceDog.Error.WRONG_ARGUMENTS, 'You specified an unknown language! (' + deserialized + ')');
  }
});
