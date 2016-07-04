import Tsygan from './tsygan';

var tra = function(item) {
  // XXX SpaceDog https://github.com/spacedog-io/services/issues/22
  item = parseInt(item, 10);
  return isNaN(item) ? undefined : item;
};

export default Tsygan.extend({
  _serializer: tra,
  _deserializer: tra
});
