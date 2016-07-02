import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    return item;// JSON.parse(item);
  },

  _serializer(item) {
    return item;// JSON.stringify(item);
  }
});
