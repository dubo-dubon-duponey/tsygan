import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Ember.Service.extend({

  unregister: function(name){
    var application = Ember.getOwner(this);

    try{
      application.unregister('model:' + name);
    }catch(e){
      console.warn('Failed un-registering ', name, ' with exception ', e);
    }
  },

  // Register a new model based on a schema
  register: function(schema){
    var application = Ember.getOwner(this);

    var cfg = {};
    // Enumerate fields and create properties accordingly
    schema.get('fields').forEach(function(item){
      // Declare a field from the schemafield name, passing the serialized field as an option to transforms
      var type = item.get('type');
      switch(type){
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

    // Attach the schema at init time for later access - XXX that must not be serialized nor saved
    var modelName = schema.get('id');
    /*cfg.init = function(){
      this._super(...arguments);
      this.set('tsyganSchemaRecord', schema);
    };*/

    // The model exposes a method to perform validation per-key
    /*cfg.validate = function(key, value){
      var typeForKey = this.get('tsyganSchemaRecord.fields').find(function(item){
        return item.get('name') === key;
      }).get('type');
      var transform = application.lookup('transform:tsygan@' + typeForKey);
      //
    };*/

    application.register('model:' + modelName, Model.extend(cfg));
  }
});
