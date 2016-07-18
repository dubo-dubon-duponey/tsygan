import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    if (!item)
      return;
    var ret = new Date(item);
    try {
      ret.toISOString();
    } catch (e){
      console.warn('Trying to deserialize invalid time will return undefined!', e);
      return;
    }
    return ret;
  },

  _serializer(item) {
    if (!item || !item.toISOString)
      return;
    var ret;
    try {
      ret = item.toISOString();
    } catch (e){
      console.warn('Trying to serialize invalid date returns undefined!', e);
      return;
    }
    return ret;
  }
});
