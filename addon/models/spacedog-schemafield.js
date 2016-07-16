import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
const { computed, observer } = Ember;
import { belongsTo } from 'ember-data/relationships';
import Constants from 'tsygan/constants';
const { types } = Constants;

// This defines what a schema field is, using solely tsygan transforms
// Ideally, this could be exoressed as a schema itself
export default Model.extend({
  // Name of the field - should be any string
  name:             attr('tsygan@string'),
  // Type of the field (see typeOptions below for choises)
  type:             attr('tsygan@enum', {'enum-set': Object.keys(types)}),
  // Whether the field is an array of things
  array:            attr('tsygan@boolean', {defaultValue: false}),
  // In case the field type is a string, what language is that (see transforms)
  language:         attr('tsygan@spacedog-language', {defaultValue: 'English'}),
  // If type is an enum, determines the list of allowed values
  enumSet:          attr('tsygan@string', {array: true}),
  // If type is hasMany or belongsTo, this link to the model name it relates to
  relatedTo:        attr('tsygan@string'),
  // Any type may provide a list of examples to display to the user (up to the implementor to use them or not,
  // typically as placeholders in inputs).
  examples:         attr('tsygan@string', {array: true}),
  // Whether the field should be required - if it is, a defaultValue can be specified
  // For array-ed, the require applies for the entire array, not individual elements
  required:         attr('tsygan@boolean', {defaultValue: false}),
  // Default value, in case the field is required
  // For arrays, the default is for the entire array, not for individual elements - complex objects used as
  // defaultValues are shallow copied, so careful with modifying them
  // A default value would usually override the first "example" as a placeholder in inputs
  defaultValue:     attr('tsygan@string'),

  // Numerical types may have restrictions (<, <=, >, >= and step)
  // Step is usable only with gte, and will coerce values to match `gte + n * step`
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

  // Links back to the parent model this field belongs to
  parentModel:      belongsTo('tsygan@spacedog-schema'),

  // This returns the type choices that are available, depending on whether the object is sealed (field has already
  // been saved to SpaceDog, or not)
  // If the former, then only subtypes changes are allowed
  // If the latter, then all types are available
  typeOptions: computed('_spacetypehard', function(){
    // If it sealed, restrict to that
    var sth = this.get('_spacetypehard');
    // Either the object is un-sealed (all types), or it is (restricted to same spacedog type)
    return Object.keys(types).filter(function(key){
      return !sth || types[key] === sth;
    });
  }),

  // XXX all these are somewhat ugly hacks
  // This method MUST be called after a first save, and will mark the field as "locked" on SpaceDog
  seal: function(){
    if (!this.get('_spacetypehard'))
      this.set('_spacetypehard', this.get('_spacetypesoft'));
  },

  sealed: computed('_spacetypehard', function(){
    return !!this.get('_spacetypehard');
  }),

  // The hard type will be there if the object was saved on the service already, to keep track of the actual
  // SpaceDog type.
  // This is to accomodate for the types that we don't know how to preserve (long vs. int, float vs. double)
  _spacetypehard:        attr('string'),
  // The soft type if the SpaceDog type we will infer if we are saving for the first time
  _spacetypesoft:      attr('string'),


  // Observes the type to adjust what we will send to SpaceDog (on first save)
  typeObserver: observer('type', function(){
    this.set('_spacetypesoft', types[this.get('type')]);
  }),

  init: function(){
    /* eslint no-dangle-underscore:0 */
    this._super(...arguments);
    this.set('_spacetypesoft', types[this.get('type')]);
  },

  // Helpers for component template
  hasRelation:      computed('type', function () {
    const currentType = this.get('type');
    return currentType === 'hasMany' || currentType === 'belongsTo';
  }),

  hasArray:         computed('type', function(){
    const currentType = this.get('type');
    return ['json', 'belongsTo', 'hasMany'].indexOf(currentType) === -1;
  }),

  hasLanguage:         computed('type', function(){
    return this.get('type') === 'string';
  }),

  hasPattern:         computed('type', function(){
    return ['string', 'identifier', 'password'].indexOf(this.get('type')) !== -1;
  }),

  hasBoundaries:         computed('type', function(){
    return ['integer', 'number'].indexOf(this.get('type')) !== -1;
  }),

  hasEnum:         computed('type', function(){
    const currentType = this.get('type');
    return currentType === 'enum';
  }),

  fieldEnumSet: computed('enumSet', {
    get(/*key*/) {
      return (this.get('enumSet') || []).join(',');
    },
    set(key, value) {
      return this.set('enumSet', (value || '').split(','));
    }
  })
});
