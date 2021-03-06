import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item, options) {
    if ((options['enum-set'] || []).indexOf(item) === -1)
      return;
    return item;
  },

  _serializer(item, options) {
    if ((options['enum-set'] || []).indexOf(item) === -1)
      return;
    return item;
  }
});
