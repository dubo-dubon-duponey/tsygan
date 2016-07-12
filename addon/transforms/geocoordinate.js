import Tsygan from './tsygan';

var regthis = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

export default Tsygan.extend({
  _deserializer(item) {
    item = String(item);
    var valid = item.match(regthis);
    if (!valid)
      return;
    item = item.toString().split(',');
    return {
      latitude: parseFloat(item.shift()),
      longitude: parseFloat(item.shift())
    };
  },

  _serializer(item) {
    if (!item || !item.latitude || !item.longitude)
      return;
    return String(item.latitude) + ',' + String(item.longitude);
  }
});
