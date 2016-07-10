/*global SpaceDog:false*/
import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    item = String(item);
    return SpaceDog.IMF.isValidAddress(item) ? item : undefined;
  },

  _serializer(item) {
    item = String(item);
    return SpaceDog.IMF.isValidAddress(item) ? item : undefined;
  }
});
