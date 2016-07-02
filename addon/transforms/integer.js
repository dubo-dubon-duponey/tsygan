import Tsygan from './tsygan';

export default Tsygan.extend({
  _serializer: function(item) {
    return isNaN(item) ? undefined : item;
  },

  _deserializer: function(item) {
    item = parseInt(item, 10);
    if (isNaN(item))
      item = undefined;
    return item;
  }
});
