import Model from 'ember-data/model';
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

// This is the default base model for models defined after schemas
export default Model.extend({
  tsyganSchemaRecord: null

/*  init = function(){
    this._super(...arguments);
    this.set('tsyganSchemaRecord', schema);
  };
*/
  // The model exposes a method to perform validation per-key
  /*cfg.validate = function(key, value){
   var typeForKey = this.get('tsyganSchemaRecord.fields').find(function(item){
   return item.get('name') === key;
   }).get('type');
   var transform = application.lookup('transform:tsygan@' + typeForKey);
   //
   };*/

});
