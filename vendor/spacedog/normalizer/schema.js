(function(){
  'use strict';

  var TYPE = 'tsygan@spacedog-schema';
  var LOG_PREFIX = 'com.spacedog.tsygan::normalizer->schema::';

  (function(){

    this.schema = function(response){
      console.warn(LOG_PREFIX + 'default <<>>', response);
      return response;
    };

    var schemafield = function(name, hash) {
      console.debug(LOG_PREFIX + 'schemafield <<', name, hash);

      var id, def, en, parent;
      if(hash._extra){
        id = hash._extra['com.spacedog.tsygan::id'];
        def = hash._extra['com.spacedog.tsygan::default'];
        en = hash._extra['com.spacedog.tsygan::enum'];
        parent = hash._extra['com.spacedog.tsygan::parent'];
      } else {
        id = SpaceDog.md5.crypt(JSON.stringify(hash));
      }

      var json = {
        id: id,
        type: 'tsygan@spacedog-schemafield',
        attributes: {
          name: name,
          type: hash._type,
          required: hash._required,
          language: hash._language,
          array: hash._array,
          'default-value': def,
          'enum-set': en
        },
        relationships: {
          'parent-model': {
            data: {
              type: TYPE,
              id: parent
            }
          }
        }
      };
      console.debug(LOG_PREFIX + 'schemafield >>', json);
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
        id: payload.meta.id,
        type: TYPE // XXX can't trust payload.meta.type because...
      };
      delete payload.meta.id;
      delete payload.meta.type;
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

      var attrs = [];
      // Included records for the fields out of band
      output.included = attrs;

      // For each schema
      Object.keys(response).forEach(function(schemaId, index) {
        // We will have relations to fields
        var ids = [];
        // And embedded fields as well
        output.data[index] = {
          // Ember id of the schema is the key/name
          id: schemaId,
          // Type is actually schema, but then
          type: TYPE,
          // Add the relationships ids to be linked
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
        // This is our own internal ids, that are fine, thank you
        delete response[schemaId].id;
        // XXX no need for now
        // delete response[schemaId].type;
        // Now, the remainder is actual fields


        Object.keys(response[schemaId]).forEach(function(attrName){
          var id;
          if(response[schemaId][attrName]._extra)
            id = response[schemaId][attrName]._extra['com.spacedog.tsygan::id'];
          else
            id = SpaceDog.md5.crypt(JSON.stringify(response[schemaId][attrName]));
          // So, this is the "short version"
          ids.push({
            id: id,
            type: 'tsygan@spacedog-schemafield'
          });

          attrs.push(schemafield(attrName, response[schemaId][attrName]));
        });
      });

      if(singular)
        output.data = output.data.pop();
      console.debug(LOG_PREFIX + 'get >>', output);
      return output;
    };

  }).apply(this.normalize || (this.normalize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));


