import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';
import JSONAPISerializer from 'ember-data/serializers/json-api';

// For schemas, we need to embed fields into the record
export default JSONAPISerializer.extend(EmbeddedRecordsMixin, {
  primaryKey: 'id',
  attrs: {
    fields: { embedded: 'always' }
    // ACL and triggers will likely need to be embedded as well
    /*,
     _acl: { embedded: 'always' },
     _triggers: { embedded: 'always' }
     */
  }
});
