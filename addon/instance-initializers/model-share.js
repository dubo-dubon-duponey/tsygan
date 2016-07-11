export function initialize(application) {
  console.debug('com.tsygan::model-share-initializer <<');

  var store = application.lookup('service:store');

  var share = store.createRecord('tsygan@spacedog-schema', {
    id: 'tsygan@spacedog-share',
    fields: []
  });

  share.get('fields').pushObjects([
    store.createRecord('tsygan@spacedog-schemafield', {
      name: 'contentType',
      type: 'string',// XXX create a type for media types
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

  console.debug('com.tsygan::model-share-initializer >> done creating share model');
}

export default {
  name: 'model-share',
  before: 'tsygan',
  initialize
};

// We could push payloads as if they were coming from the service
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
