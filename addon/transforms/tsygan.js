import Transform from 'ember-data/transform';

export default Transform.extend({

  serialize: function (d, options) {
    // console.debug('com.tsygan::transform->serialize << ', d, '*', options);
    options = options || {};
    // Do we have a special serializer?
    if (d !== undefined && this.get('_serializer')){
      if (options.array)
        d = d.map(function(item){
          return this.get('_serializer').apply(this, [item, options]);
        }, this);
      else
        d = this.get('_serializer').apply(this, [d, options]);
    }
    if (d === undefined && options.required){
      if (options['default-value'])
        return options['default-value'];
      throw new SpaceDog.Error(SpaceDog.Error.NOT_INITIALIZED, 'Property ' + options.name + ' of type ' +
        options.type + 'that is required but undefined with no default value on serialization.');
    }
    // console.debug('com.tsygan::transform->serialize >> ', d);
    return d;
  },

  deserialize: function (d, options) {
    // console.debug('com.tsygan::transform->deserialize << ', d, '*', options);
    options = options || {};
    // Do we have a special serializer?
    try {
      if (d !== undefined && this.get('_deserializer')){
        if (options.array)
          d = d.map(function(item){
            return this.get('_deserializer').apply(this, [item, options]);
          }, this);
        else
          d = this.get('_deserializer').apply(this, [d, options]);
      }
      if (d === undefined && options.required){
        if (options['default-value'])
          return options['default-value'];
        throw new SpaceDog.Error(SpaceDog.Error.NOT_INITIALIZED, 'Property ' + options.name + ' of type ' +
          options.type + 'that is required but undefined with no default value on deserialization.');
      }
      // console.debug('com.tsygan::transform->deserialize >> ', d);
      return d;
    } catch (e){
      console.warn('!!!!! FAILURE - com.tsygan::transform->serialize << ', e);
      throw e;
    }
  }
});
