(function(){
  'use strict';
  (function(){

    var LOG_PREFIX = 'com.tsygan::serializer->share::';

    this.share = function(jsonAPIData) {
      throw new Error('Unhandled serialization on share for content', jsonAPIData);
    };

    // Putting a share just sends the payload and that's it
    this.share.put = function(jsonAPIData) {
      console.debug(LOG_PREFIX + 'put <<>>', jsonAPIData.data.attributes.file.length);
      return jsonAPIData.data.attributes.file;
    };

  }).apply(this.serialize || (this.serialize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));
