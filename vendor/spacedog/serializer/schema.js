(function(){
  'use strict';

  var LOG_PREFIX = 'com.spacedog.tsygan::serializer->schema::';

  (function(){

    // How to serialize Schemas
    this.schema = function(jsonAPIData) {
      console.warn(LOG_PREFIX + 'default <<>>', jsonAPIData);
      return JSON.stringify(jsonAPIData);
    };

    this.schema.put = function(jsonAPIData) {
      console.debug(LOG_PREFIX + 'put <<', jsonAPIData);
      var data = jsonAPIData.data;

      var output = {};
      // Schema root
      output[data.id] = {
        _id: 'id',
        _type: 'object'
      };

      // Re-inject every individual field at the root
      // if('relationships' in data)
      data.fields.forEach(function(item){
        item = schemafield(item);
        var key = Object.keys(item).pop();
        output[data.id][key] = item[key];
      });

      // Spoof in the id field as well, unless it has been declared already
      if(!('id' in output[data.id]))
        output[data.id].id = {
          _type: 'string',
          _required: true,
          _array: false
        };

      console.debug(LOG_PREFIX + 'put >>', output);
      return JSON.stringify(output);
    };

    // How to serialize SchemaFields (only called by schema serializer, since this does not exist independently in spacedog)
    var schemafield = this.schemafield = function(jsonAPIData) {
      console.debug(LOG_PREFIX + 'schemafield << ', jsonAPIData);
      var data = jsonAPIData.data;

      var type = data.attributes.type;
      var array = data.attributes.array;

      // References are represented as strings
      if (['belongsTo', 'hasMany'].indexOf(data.attributes.type) !== -1)
        type = 'string';

      // Has-many references is an array obviously
      if (['hasMany'].indexOf(data.attributes.type) !== -1)
        array = true;

      var output = {};
      output[data.attributes.name] = {
        _type: type,
        _required: data.attributes.required,
        _extra: {
          'com.spacedog.tsygan::id': data.id,
          'com.spacedog.tsygan::parent': data.relationships['parent-model'].data.id,
          'com.spacedog.tsygan::default': data.attributes['default-value'],
          'com.spacedog.tsygan::enum': data.attributes['enum-set'],
          'com.spacedog.tsygan::related': data.attributes['related-to']
        }
      };
      // XXX SpaceDog is very picky on arguments that can be there and when
      if (['stash'].indexOf(data.attributes.type) === -1)
        output[data.attributes.name]._array = array;

      if (['text'].indexOf(data.attributes.type) !== -1)
        output[data.attributes.name]._language = data.attributes.language;

      console.debug(LOG_PREFIX + 'schemafield <<', output);
      return output;
    };

  }).apply(this.serialize || (this.serialize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));
