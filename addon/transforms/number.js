import Tsygan from './tsygan';

export default Tsygan.extend({
  _serializer: function(item) {
    // XXX SpaceDog https://github.com/spacedog-io/services/issues/22
    item = parseFloat(item);
    return isNaN(item) ? undefined : item;
  },

  _deserializer: function(item) {
    item = parseFloat(item);
    return isNaN(item) ? undefined : item;
  }
});
