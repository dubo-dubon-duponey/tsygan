import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    item = item.split(',');
    return {
      latitude: parseFloat(item.pop()),
      longitude: parseFloat(item.pop())
    };
  },

  _serializer(item) {
    return item.latitude + ',' + item.longitude;
  }
});
