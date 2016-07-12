import Ember from 'ember';
import Tsygan from 'tsygan/models/tsygan';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

// This is a convenience base class (extended by "domain") to provide with registration and unregistration of
// schemaRecords into models
// Not that registering models in time is critical for application routing to work, so, usually instance-initializers
// would synchronously do that by calling register on payload already retrieved.
// Dynamic model updating should only be required for back-offices, or other apps that let the user change backends.
// You should not use this class directly, but rather the domain (or spacedog) service(s)
export default Ember.Service.extend({

  // Store
  store: Ember.inject.service('store'),

  // Destroy a model by schemaRecord
  unregister: function(schemaRecord){
    var application = Ember.getOwner(this);
    var name = schemaRecord.get('id');
    try {
      application.unregister('model:' + name);
    } catch (e){
      console.warn('Failed un-registering ', name, ' with exception ', e);
    }
  },

  // Register a new model from a schema record
  register: function(schemaRecord){
    var application = Ember.getOwner(this);

    var cfg = {};
    // Enumerate fields and create properties accordingly
    schemaRecord.get('fields').forEach(function(item){
      // Declare a field from the schemafield name, passing the serialized field as an option to transforms
      var type = item.get('type');
      switch (type){
        case 'hasMany':
          cfg[item.get('name')] = hasMany(item.get('relatedTo'));
          break;
        case 'belongsTo':
          cfg[item.get('name')] = belongsTo(item.get('relatedTo'));
          break;
        default:
          cfg[item.get('name')] = attr('tsygan@' + type, item.serialize().data.attributes);
          break;
      }
    });

    // Attach the schema id at init time for later access - XXX that must not be serialized nor saved
    // Attaching the schema itself would prevent record deletion and backend switching
    cfg.tsyganSchemaRecord = schemaRecord.get('id');
    application.register('model:' + schemaRecord.get('id'), Tsygan.extend(cfg));
  }
});
