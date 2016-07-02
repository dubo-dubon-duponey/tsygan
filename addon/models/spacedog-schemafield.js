import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
const { computed } = Ember;
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  // Name of the field
  name:             attr('string'),
  // Type of the field (see transforms for full list)
  type:             attr('tsygan@spacedog-type', {defaultValue: 'string'}),
  // In case the field type is a string, what language is that (see transforms)
  language:         attr('tsygan@spacedog-language', {defaultValue: 'English'}),
  // Links back to the parent model this schema belong to
  parentModel:      belongsTo('tsygan@spacedog-schema'),
  // Whether the field should be required - if it is, a defaultValue can be specified
  required:         attr('boolean', {defaultValue: false}),
  // Default value, in case the field is required
  defaultValue:     attr('string', {defaultValue: undefined}),
  // Whether the field is an array of things
  array:            attr('boolean', {defaultValue: false}),
  // Useful
  enumSet:         attr('enum'),

  // Implement / use: _examples, _values, _gt, _gte, _lt, _lte et _pattern

  // XXX relate to references
  relatedTo:        attr('string', {defaultValue: null}),
  hasRelation:      computed('type', function () {
    const currentType = this.get('type');
    return (currentType === 'hasMany' || currentType === 'belongsTo');
  }),

  // Computed properties to help templates decide what to display
  hasArray:         computed('type', function(){
    const currentType = this.get('type');
    return (['json', 'belongsTo', 'hasMany'].indexOf(currentType) === -1);
  }),
  hasLanguage:         computed('type', function(){
    const currentType = this.get('type');
    return (currentType === 'string');
  }),
  hasEnum:         computed('type', function(){
    const currentType = this.get('type');
    return (currentType === 'enum');
  }),

  fieldEnumSet: computed('enumSet', {
    get(/*key*/) {
      return (this.get('enumSet') || []).join(',');
    },
    set(key, value) {
      return this.set('enumSet', (value || '').split(','));
    }
  })

  /*, XXX non functional shit
   defaultJSON:        computed('defaultValue', {
   get(key) {
   return JSON.stringify(this.get('defaultValue'));
   },
   set(key, value) {
   try{
   value = JSON.parse(value.toString());
   }catch(e){
   console.warn('Fail to parse', value, '. Will use it as a string');
   }
   console.warn('Setting to', value);
   return this.set('defaultValue', value);
   }
   })*/
});
