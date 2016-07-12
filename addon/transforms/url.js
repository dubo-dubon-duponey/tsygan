import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(serialized) {
    /* global URL:false*/
    var ret;
    try {
      ret = new URL(serialized);
    } catch (e){
      return;
    }
    return ret;
  },

  _serializer(deserialized) {
    if (!deserialized || !deserialized.href)
      return;
    return String(deserialized);
  }
});
