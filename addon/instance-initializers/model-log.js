export function initialize(application) {
  console.debug('com.tsygan::model-log-initializer: create a record for a Logs schema');

  var store = application.lookup('service:store');

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
    // Too boring to express properly yet
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
}

export default {
  name: 'model-log',
  before: 'tsygan',
  initialize
};
