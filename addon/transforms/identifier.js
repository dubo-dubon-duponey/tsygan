import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    return item.toString();
  },

  _serializer(item) {
    return item.toString();
  }
});
