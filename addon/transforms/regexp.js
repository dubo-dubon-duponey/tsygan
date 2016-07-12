import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(serialized) {
    if (!serialized)
      return;
    return new RegExp(String(serialized));
  },

  _serializer(deserialized) {
    if (!deserialized || !deserialized.source)
      return;
    return deserialized ? deserialized.source : '';
  }
});
