import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item, options) {
    console.warn('enum');
    if((options['enum-set'] || []).indexOf(item) === -1)
      item = undefined;
    return item;
  },

  _serializer(item, options) {
    console.warn('enum');
    if((options['enum-set'] || []).indexOf(item) === -1)
      item = undefined;
    return item;
  }
});
