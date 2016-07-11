import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
const { computed, observer } = Ember;
import { belongsTo } from 'ember-data/relationships';
import Constants from 'tsygan/constants';
const { types } = Constants;

export default Model.extend({
  typeOptions: computed('_spacetypehard', function(){
    // If it sealed, restrict to that
    var sth = this.get('_spacetypehard');
    // Either the object is un-sealed (all types), or it is (restricted to same spacedog type)
    return Object.keys(types).filter(function(key){
      return !sth || types[key] === sth;
    });
  }),

  // Name of the field
  name:             attr('tsygan@string'),
  // Type of the field (see transforms for full list)
  type:             attr('tsygan@enum', {'enum-set': Object.keys(types)}),
  // In case the field type is a string, what language is that (see transforms)
  language:         attr('tsygan@spacedog-language', {defaultValue: 'English'}),
  // Whether the field is an array of things
  array:            attr('tsygan@boolean', {defaultValue: false}),
  // If type is an enum, determines the list of allowed values
  enumSet:          attr('tsygan@string', {array: true}),
  // If type is hasMany or belongsTo, list the linked model name
  relatedTo:        attr('tsygan@string'),

  // Any type may provide a list of examples to display to the user (up to the implementor to use them or not).
  // The first example in the list will always be used as a placeholder attribute for tsygan inputs
  examples:         attr('tsygan@string', {array: true}),

  // Numerical types may have restrictions (<, <=, >, >= and step)
  // Step is usable only with gte, and will coerce values to match (gte + n * step)
  // This apply to individual elements in an array
  step:             attr('tsygan@number'),
  gte:              attr('tsygan@number'),
  gt:               attr('tsygan@number'),
  lte:              attr('tsygan@number'),
  lt:               attr('tsygan@number'),

  // Any type may have a regexp validation pattern (does NOT support modifiers)
  // This apply to individual elements in an array
  // XXX future: could be an array to allow more fine grain validation
  // XXX implement lengths checks (can be interpolated from / to pattern?)
  pattern:          attr('tsygan@regexp'),

  // Whether the field should be required - if it is, a defaultValue can be specified
  // For array-ed, the require applies for the entire array to be defined
  required:         attr('tsygan@boolean', {defaultValue: false}),

  // Default value, in case the field is required
  // For arrays, the default is for the entire array, not for individual elements - complex objects used as defaultValues are shallow copied
  // A default value usually overrides the first example as a placeholder in tsygan inputs
  defaultValue:     attr('tsygan@string'),

  // Implement / use: _examples, _values

  // Links back to the parent model this schema belong to
  parentModel:      belongsTo('tsygan@spacedog-schema'),

  // ... unless this model was saved on the service already
  // This is to accomodate for the types that we don't know how to preserve (long vs. int, float vs. double)
  // Very ugly hack
  _spacetypehard:        attr('string'),
  _spacetypesoft:      attr('string'),

  // This holds the final SpaceDog type that we will send to the service unless...
  // XXX on save, MUST set the _spacetypehard property to fix it properly
  typeObserver: observer('type', function(){
    this.set('_spacetypesoft', types[this.get('type')]);
  }),

  seal: function(){
    this.set('_spacedoghard', this.get('_spacedogsoft'));
  },

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
