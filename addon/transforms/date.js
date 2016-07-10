import Tsygan from './tsygan';

export default Tsygan.extend({
  _deserializer(item) {
    var ret = new Date(item);
    try{
      ret.toISOString();
    }catch(e){
      console.warn('Trying to deserialize invalid time will return undefined!', e);
      return;
    }
    return ret;
  },

  _serializer(item) {
    if(!item || !item.toISOString)
      item = new Date(item);
    var ret;
    try{
      ret = item.toISOString();
    }catch(e){
      console.warn('Trying to serialize invalid time will return undefined!', e);
      return;
    }
    return ret;
  }
});
