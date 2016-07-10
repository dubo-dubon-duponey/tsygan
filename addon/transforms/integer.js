import Tsygan from './tsygan';

var tra = function(item, options) {
  // XXX SpaceDog https://github.com/spacedog-io/services/issues/22
  item = parseInt(item, 10);
  return (isNaN(item) || !this.get('_match')(item, options)) ? undefined : item;
};

export default Tsygan.extend({
  _match: function(num, options){
    var valid = (options.lt === undefined || num < options.lt) &&
      (options.gt === undefined || num > options.gt) &&
      (options.lte === undefined || num <= options.lte) &&
      (options.gte === undefined || num >= options.gte) &&
      (options.gte === undefined || options.step === undefined || ((num - options.gte) % options.step) === 0);
    return valid;
  },

  _serializer: tra,
  _deserializer: tra
});
