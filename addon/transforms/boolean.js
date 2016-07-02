import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    return !!item;
  },

  _serializer(item) {
    return !!item;
  }
});
