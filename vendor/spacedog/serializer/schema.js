(function(){
  /* eslint strict:0*/
  'use strict';

  var LOG_PREFIX = 'com.tsygan::serializer->schema::';

  (function(){
    /* eslint no-underscore-dangle:0 */

    // How to serialize Schemas
    this.schema = function(jsonAPIData) {
      throw new Error('Unhandled serialization on schemas for content', jsonAPIData);
    };

    // How to serialize SchemaFields (only called by schema serializer, since this does not exist
    // independently in spacedog)
    var schemafield = this.schemafield = function(jsonAPIData) {
      console.debug(LOG_PREFIX + 'schemafield << ', jsonAPIData);
      var data = jsonAPIData.data;

      var array = data.attributes.array;

      // XXX should not be here
      // Has-many references is forcedly an array - might weirdly create different _array and
      // tsygan::attributes->array values
      if (['hasMany'].indexOf(data.attributes.type) !== -1)
        array = true;

      // Get a possibly previously saved SpaceDog type, or get the infered one from ours
      var type = data.attributes._spacetypehard || data.attributes._spacetypesoft;
      // These are hackish ways to preserve SpaceDog inner types, not to be stored
      delete data.attributes._spacetypesoft;
      delete data.attributes._spacetypehard;

      // Start preparing the output
      var output = {
        // Set the _type
        _type: type,
        // Shallow copy these to hint SpaceDog at what we do
        _required: data.attributes.required,
        _lt: data.attributes.lt,
        _lte: data.attributes.lte,
        _gt: data.attributes.gt,
        _gte: data.attributes.gte,
        _pattern: data.attributes.pattern,
        _examples: data.attributes.examples,
        _extra: {
          // Spoof in the entirety of our object here (makes it simpler to normalize) and pave the way for SpaceDog 2
          'com.tsygan::1.0::': data
        }
      };
      // XXX SpaceDog is very picky on arguments that can be there and when, so, add them only if allowed
      if (['stash'].indexOf(type) === -1)
        output._array = array;

      if (['text'].indexOf(type) !== -1)
        output._language = data.attributes.language;

      if (['enum'].indexOf(type) !== -1)
        output._values = data.attributes['enum-set'];

      console.debug(LOG_PREFIX + 'schemafield <<', output);
      return [data.attributes.name, output];
    };

    this.schema.put = function(jsonAPIData) {
      console.debug(LOG_PREFIX + 'put <<', jsonAPIData);
      var data = jsonAPIData.data;

      // Schema root: we force id as identifier field, and default to Object
      var output = {
        _id: 'id',
        _type: 'object'
      };

      // Re-inject every individual field at the root
      data.fields.forEach(function(item){
        item = schemafield(item);
        output[item.pop()] = item.pop();
      });

      // Spoof in the id field as well, unless it has been declared already
      // This is solely for SpaceDog - we ignore/override id definitions
      if (!('id' in output))
        output.id = {
          _type: 'string',
          _required: true
        };

      // Create the final object, using the id as main key
      var ret = {};
      ret[data.id] = output;
      console.debug(LOG_PREFIX + 'put >>', ret);
      return JSON.stringify(ret);
    };

  }).apply(this.serialize || (this.serialize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));
