(function(){
  /* globals SpaceDog:false */
  /* eslint no-underscore-dangle:0 */
  /* eslint strict:0*/
  'use strict';

  var TYPE = 'tsygan@spacedog-schema';
  var LOG_PREFIX = 'com.tsygan::normalizer->schema::';

  (function(){

    this.schema = function(response){
      throw new Error('Unhandled normalization on schemas for content', response);
    };

    // Private helper to normalize schema fields
    var schemafield = function(name, hash, schemaId) {
      // console.debug(LOG_PREFIX + 'schemafield <<', name, hash, schemaId);

      // XXX SpaceDog https://github.com/spacedog-io/services/issues/50
      // Currently, password field are mangled by the log sanitizer, restore a fake password field
      // for the sake of the user model
      // Spoof in a skeleton password field here
      if (name === 'password')
        hash = {
          _type: 'string'
        };

      // If this is a pure SpaceDog object, insert our extra section
      if (!hash._extra)
        hash._extra = {};
      if (!hash._extra['com.tsygan::1.0::'])
        hash._extra['com.tsygan::1.0::'] = {};

      // Start with that
      var json = hash._extra['com.tsygan::1.0::'];

      // Preserve the SpaceDog exact type in there
      json.attributes._spacetypehard = hash._type;

      // If the object is incomplete, or if it's not a tsygan object, use SpaceDog properties to populate it
      // These properties are "as-is"
      ['lt', 'gt', 'lte', 'gte', 'required', 'array', 'examples', 'pattern'].forEach(function(key){
        if (!(key in json.attributes))
          json.attributes[key] = hash['_' + key];
      });

      // Values / enum-set mapping
      if (!('enum-set' in json.attributes))
        json.attributes['enum-set'] = hash._values;

      // If it's not there, build type from spacedog (left) to ours (right)
      if (!json.attributes.type){
        var mapit = {
          boolean: 'tsygan@boolean',
          enum: 'tsygan@enum',
          geopoint: 'tsygan@geocoordinates',
          stash: 'tsygan@json',
          text: 'tsygan@string',
          integer: 'tsygan@integer',
          long: 'tsygan@integer',
          float: 'tsygan@number',
          double: 'tsygan@number',
          string: 'tsygan@identifier',
          date: 'tsygan@date',// XXX not sure the service will accept timestamps on that
          time: 'tsygan@date',// XXX not sure the service will accept timestamps on that
          timestamp: 'tsygan@date',
          ref: 'belongsTo'
        };

        // If SpaceDog introduced a type we don't understand, that's pretty bad, but we survive
        if (!(hash._type in mapit)){
          console.warn('ALERT: unknown SpaceDog type: ', hash._type,
            ' - falling back on string to leave the data as-is.');
          hash._type = 'string';
        }
        json.attributes.type = mapit[hash._type];
        // If we have a ref + array, then it's a "many" type
        if (json.attributes.array && json.attributes.type === 'belongsTo')
          json.attributes.type = 'hasMany';
      }

      // No id? Generate one
      if (!json.id)
        json.id = SpaceDog.md5.crypt(JSON.stringify(hash));

      // No name? Insert it
      if (!json.attributes.name)
        json.attributes.name = name;

      // Type is always a schemafield obviously
      if (!json.type)
        json.type = 'tsygan@spacedog-schemafield';

      // Insert the relation ship if need be
      if (!json.relationships)
        json.relationships = {
          'parent-model': {
            data: {
              type: TYPE,
              id: schemaId
            }
          }
        };
      // console.debug(LOG_PREFIX + 'schemafield >>', json);
      return json;
    };

    this.schema.delete = function(response, url){
      console.debug(LOG_PREFIX + 'delete <<', response);
      var json = {
        data: {
          // XXX this is dangerous, and necessary because of % (for eg) being allowed in urls
          id: decodeURIComponent(url.split('/').pop()),
          type: TYPE
        }
      };
      console.debug(LOG_PREFIX + 'delete >>', json);
      return json;
    };

    this.schema.put = function(response){
      console.debug(LOG_PREFIX + 'put <<', response);
      var payload = {meta: response};
      payload.data = {
        id: response.id,
        type: TYPE // XXX can't trust payload.meta.type because...
      };
      delete response.id;
      delete response.type;
      console.debug(LOG_PREFIX + 'put >>', payload);
      return payload;
    };

    // This will handle responses for all requests to the "/1/schema" endpoint, unless there is a more specialized one
    this.schema.get = function(response, url){
      console.debug(LOG_PREFIX + 'get <<', response);

      var singular = url.split('/').length > 5;

      var output = {
        data: [],
        meta: {}
      };

      // Denormalized fields for all schemas will leave here
      var attrs = output.included = [];

      // For each schema
      Object.keys(response).forEach(function(schemaId, index) {
        // We will have relations to fields
        var ids = [];
        // And embedded fields as well
        output.data[index] = {
          // Ember id of the schema is actually the name of the schema
          id: schemaId,
          // Type is schema
          type: TYPE,
          // Add the fields will be linked here
          relationships: {
            fields: {
              data: ids
            }
          }
        };

        // Remove useless/spurious attributes
        // Ignore these two entirely from SpaceDog
        delete response[schemaId]._id;
        delete response[schemaId]._type;
        // We don't need a definition for id fields, since we use our own internally
        delete response[schemaId].id;

        // Now, the remainder is actual fields
       Object.keys(response[schemaId]).forEach(function(attrName){
         // Insert the field into the denormalized map, and link it
          var field = schemafield(attrName, response[schemaId][attrName], schemaId);

          ids.push({
            id: field.id,
            type: field.type
          });

          attrs.push(field);
        });
      });

      // Just one object? Pop it
      if (singular)
        output.data = output.data.pop();
      console.debug(LOG_PREFIX + 'get >>', output);
      return output;
    };

  }).apply(this.normalize || (this.normalize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));


