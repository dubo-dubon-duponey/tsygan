import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    var ret;
    try{
      ret = new URL(serialized);
    }catch(e){
      return;
    }
    return ret;
  },

  serialize(deserialized) {
    if(!deserialized || !deserialized.href)
      return;
    return String(deserialized);
  }
});
