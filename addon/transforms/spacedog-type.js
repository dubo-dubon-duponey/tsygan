/* global SpaceDog:false */
import Transform from 'ember-data/transform';

import Constants from 'tsygan/constants';
const { types } = Constants;

export default Transform.extend({
  deserialize: function (serialized, options) {
    serialized = serialized || types[options.defaultValue];
    var ret;
    Object.keys(types).some(function (key) {
      if (serialized === types[key])
        return ret = key;
    });
    if (!ret)
      throw new SpaceDog.Error(SpaceDog.Error.WRONG_ARGUMENTS, 'Unhandled type from SpaceDog service! (' + serialized + ')');
    return ret;
  },

  serialize: function (deserialized, options) {
    deserialized = deserialized || options.defaultValue;
    if (deserialized in types)
      return types[deserialized];
    throw new SpaceDog.Error(SpaceDog.Error.WRONG_ARGUMENTS, 'You specified an unknown type! (' + deserialized + ')');
  }

});
