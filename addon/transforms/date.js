import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    return new Date(item);
  },

  _serializer(item) {
    if(!item.toISOString)
      item = new Date(item);
    return item.toISOString();
  }
});
