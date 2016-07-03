/* global SpaceDog:false */
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

var registerModel = SpaceDog.register = function(application, schema, additions){
  var cfg = {};
  schema.get('fields').forEach(function(item){
    // Declare a field from the schemafield name, of type prefixed by spacedog_, passing the serialized field as an option to transforms
    var type = item.get('type');
    switch(type){
      case 'hasMany':
        cfg[item.get('name')] = hasMany(item.get('relatedTo'));
        break;
      case 'belongsTo':
        cfg[item.get('name')] = belongsTo(item.get('relatedTo'));
        break;
      default:
        // XXX can use hasMany for arrays?
        cfg[item.get('name')] = attr('tsygan@' + type, item.serialize().data.attributes);
        break;
    }
  });

  // A dirty trick to allow decoy types
  (additions || []).forEach(function(item){
    cfg[item.name] = attr('tsygan@' + item.type, {});
  });

  var modelName = schema.get('id');//.capitalize();
  console.warn('registering', modelName);
  application.register('model:' + modelName, Model.extend(cfg));
};

export function initialize(application) {
  /**
   * Generate the model for shares and logs
   */
  var store = application.lookup('service:store');
  console.warn('GOT STORE', store);
  // We can push payloads as if they were coming from the service
  /*store.pushPayload({
    data: {
      id: 'tsygan@spacedog-share',
      type: 'tsygan@spacedog-schema',
      relationships: {
        fields: {
          data: [
            {
              id: 1,
              type: 'tsygan@spacedog-schemafield'
            }
          ]
        }
      }
    },
    included: [{
      id: 1,
      type: 'tsygan@spacedog-schemafield',
      attributes: {
        name: 'contentType',
        type: 'string',
        required: true,
        defaultValue: 'application/octet-stream',
        parentModel: {
          id: 'tsygan@spacedog-share',
          type: 'tsygan@spacedog-schema'
        }
      }
    }]
  });*/

  var share = store.createRecord('tsygan@spacedog-schema', {
    id: 'tsygan@spacedog-share',
    fields: []
  });

  share.get('fields').pushObjects([
    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'contentType',
      type: 'string',
      required: true,
      defaultValue: 'application/octet-stream',
      parentModel: share
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'path',
      type: 'identifier',
      parentModel: share
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'size',
      type: 'integer',
      required: true,
      parentModel: share
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'lastModified',
      type: 'date',
      defaultValue: new Date(),
      parentModel: share
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'filename',
      type: 'identifier',
      required: true,
      parentModel: share
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'etag',
      type: 'identifier',
      parentModel: share
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'file',
      type: 'binary',
      parentModel: share
    })
  ]);

  var logCredential = store.createRecord('tsygan@spacedog-schema', {
    id: 'tsygan@spacedog-log-credential',
    fields: []
  });

  logCredential.get('fields').pushObjects([
    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'type',
      type: 'enum',
      required: true,
      defaultValue: 'USER',
      enumSet: ['KEY', 'USER', 'OPERATOR', 'ADMIN', 'SUPER_ADMIN', 'SUPERDOG'],
      parentModel: logCredential
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'name',
      type: 'string',
      required: true,
      language: 'English',
      parentModel: logCredential
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'backendId',
      type: 'identifier',
      required: true,
      parentModel: logCredential
    })
  ]);

  var logSchema = store.createRecord('tsygan@spacedog-schema', {
    id: 'tsygan@spacedog-log',
    fields: []
  });

  logSchema.get('fields').pushObjects([
    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'method',
      type: 'enum',
      required: true,
      defaultValue: 'GET',
      enumSet: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'path',
      type: 'string',
      required: true,
      language: 'English',
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'receivedAt',
      type: 'date',
      required: true,
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'processedIn',
      type: 'integer',
      required: true,
      defaultValue: 0,
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'status',
      type: 'integer',
      required: true,
      defaultValue: 200,
      parentModel: logSchema
    }),


    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'response',
      type: 'json',
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'jsonContent',
      type: 'json',
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'credentials',
      type: 'json',
      parentModel: logSchema
    }),
    // Too boring to express properly
    /*      type: 'belongsTo',
     relatedTo: 'tsygan@spacedog-log-credential',*/

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'query',
      type: 'json',
      parentModel: logSchema
    }),

    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'headers',
      type: 'json',
      parentModel: logSchema
    })
  ]);

  registerModel(application, logCredential);
  registerModel(application, logSchema);
  registerModel(application, share);
}

export default {
  name: 'spacedog',
  initialize
};
