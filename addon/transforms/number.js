import Integer from './integer';


var tra = function(item, options) {
  item = parseFloat(item);
  return (isNaN(item) || !this.get('_match')(item, options)) ? undefined : item;
};

export default Integer.extend({
  _serializer: tra,
  _deserializer: tra
});
