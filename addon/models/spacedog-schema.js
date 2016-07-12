import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

// XXX Must validate schema name (id), so they don't contain \\,/, *, ?, \", <, >, |,  , ,
export default Model.extend({
  fields: hasMany('tsygan@spacedog-schemafield')
});

