import Tsygan from './tsygan';

export default Tsygan.extend({
  validate: function(item, pattern){
    // No longer a regexp at this point - shame
    return !pattern || (new RegExp(pattern)).test(item);
  },

  _deserializer(item, options) {
    if (item === undefined)
      return;
    item = String(item);
    return this.get('validate')(item, options.pattern) ? item : undefined;
  },

  _serializer(item, options) {
    if (item === undefined)
      return;
    item = String(item);
    return this.get('validate')(item, options.pattern) ? item : undefined;
  }
});

