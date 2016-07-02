(function(){
  'use strict';

  // Serialization occurs just after Ember is done preparing the payloads to be sent.
  // Ember output is JSONAPI compliant, and we turn it into SpaceDog lingo.
  // The engine looks up specific serialization methods, based on the endpoint, and the method.
  // Example: for a POST query to the /1/schema endpoint, the following serialization functions will be looked-up, and
  // the last existing one will be used:
  // - SpaceDog.serialize
  // - SpaceDog.serialize.schema
  // - SpaceDog.serialize.schema.post
  // At the very least, we... do nothing

  var defaultSerializer = function(jsonAPIData){
    console.warn('com.spacedog.tsygan::serializer->root <<>>', jsonAPIData);
    return jsonAPIData;
  };

  var idemSerializer = function(options){
    // Process data options for methods without body
    var data = Object.getOwnPropertyNames(options.data || {}).map(function(key){
      return key + '=' + options.data[key];
    }).join('&');
    delete options.data;
    if (data)
      options.url += '?' + data;
  };

  this.serialize = function(options){
    // Idempotent serializers have a different strategy
    if(['POST', 'PUT', 'PATCH'].indexOf(options.type) === -1)
      return idemSerializer(options);

    // Urls at that point resemble "/service/identifier/foo/bar/baz"
    var service = options.url.split('/');
    var processor = this.serialize[service[4]] || defaultSerializer;
    return options.data = (processor[options.type.toLowerCase()] || processor)(options.data);
  };

}).apply(this.SpaceDog || (this.SpaceDog = {}));
