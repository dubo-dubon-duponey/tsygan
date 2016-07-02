import Model from 'ember-data/model';
// import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

// XXX Schema name (id) must not contain \\,/, *, ?, \", <, >, |,  , ,
export default Model.extend({
  fields: hasMany('tsygan@spacedog-schemafield')
});

