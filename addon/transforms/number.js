import Tsygan from './tsygan';

export default Tsygan.extend({
  // Send undefined, not NaN
  _serializer: function(item) {
    return isNaN(item) ? undefined : item;
  },

  _deserializer: function(item) {
    item = parseFloat(item);
    if (isNaN(item))
      item = undefined;
    return item;
  }
});
