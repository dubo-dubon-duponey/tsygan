/* jshint node: true */
/* eslint-env node */

module.exports = {
  name: 'tsygan',
  included: function included(app) {
    /* eslint no-underscore-dangle:0 */
    app.import('vendor/spacedog/jsboot/error.js');
    app.import('vendor/spacedog/jsboot/rfc1321-md5.js');
    app.import('vendor/spacedog/jsboot/rfc2234-5234-abnf.js');
    app.import('vendor/spacedog/jsboot/rfc4122-uuid.js');
    app.import('vendor/spacedog/jsboot/rfc5322-imf.js');
    app.import('vendor/spacedog/utils/json.js');
    app.import('vendor/spacedog/utils/json.css');

    // Normalizers
    app.import('vendor/spacedog/normalizer/default.js');
    app.import('vendor/spacedog/normalizer/log.js');
    app.import('vendor/spacedog/normalizer/share.js');
    app.import('vendor/spacedog/normalizer/schema.js');
    app.import('vendor/spacedog/normalizer/user.js');

    // Serializers
    app.import('vendor/spacedog/serializer/default.js');
    app.import('vendor/spacedog/serializer/share.js');
    app.import('vendor/spacedog/serializer/schema.js');
    app.import('vendor/spacedog/serializer/user.js');

    // Hacks and boot
    app.import('vendor/spacedog/hack.js');

    // Transforms
/*
    app.import('vendor/spacedog/transforms.js');
    app.import('vendor/spacedog/transforms/binary.js');
    app.import('vendor/spacedog/transforms/date.js');
    app.import('vendor/spacedog/transforms/enum.js');
    app.import('vendor/spacedog/transforms/geocoordinate.js');
    app.import('vendor/spacedog/transforms/identifier.js');
    app.import('vendor/spacedog/transforms/integer.js');
    app.import('vendor/spacedog/transforms/json.js');
    app.import('vendor/spacedog/transforms/number.js');
    app.import('vendor/spacedog/transforms/string.js');
    app.import('vendor/spacedog/transforms/tsygan.js');
 // Final ajax wrapper
 app.import('vendor/spacedog/ajax.js');
    */

    this._super.included(app);
  }
};
