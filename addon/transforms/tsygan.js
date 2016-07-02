/* global SpaceDog:false */
import Transform from 'ember-data/transform';

export default Transform.extend({

  serialize: function (d, options) {
    console.debug('com.spacedog.tsygan::transform->serialize << ', d, '*', options);
    // Do we have a special serializer?
    if(d !== undefined && this.get('_serializer')){
      if (options.array)
        d = d.map(function(item){
          return this.get('_serializer')(item, options);
        }, this);
      else
        d = this.get('_serializer')(d, options);
    }
    if(d === undefined && options.required){
      if(options['default-value'])
        return options['default-value'];
      throw new SpaceDog.Error(SpaceDog.Error.NOT_INITIALIZED, 'Property ' + options.name + ' of type ' + options.type + 'that is required but undefined with no default value on serialization.');
    }
    console.debug('com.spacedog.tsygan::transform->serialize >> ', d);
    return d;
  },

  deserialize: function (d, options) {
    console.debug('com.spacedog.tsygan::transform->deserialize << ', d, '*', options);
    // Do we have a special serializer?
    try{
      if(d !== undefined && this.get('_deserializer')){
        if (options.array)
          d = d.map(function(item){
            return this.get('_deserializer')(item, options);
          }, this);
        else
          d = this.get('_deserializer')(d, options);
      }
      if(d === undefined && options.required){
        if(options['default-value'])
          return options['default-value'];
        throw new SpaceDog.Error(SpaceDog.Error.NOT_INITIALIZED, 'Property ' + options.name + ' of type ' + options.type + 'that is required but undefined with no default value on deserialization.');
      }
      console.debug('com.spacedog.tsygan::transform->deserialize >> ', d);
      return d;
    }catch(e){
      console.warn('!!!!! FAILURE - com.spacedog.tsygan::transform->serialize << ', e);
      throw e;
    }
  }
});
