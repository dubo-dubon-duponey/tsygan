(function(){
  'use strict';

  // Normalization processes payloads returned by the SpaceDog service into proper JSONAPI responses
  // The engine looks up specific translation methods, based on the endpoint, and the method.
  // Example: for a POST query to the /1/schema endpoint, the following normalizing functions will be looked-up, and
  // the last existing one will be used:
  // - SpaceDog.normalize
  // - SpaceDog.normalize.schema
  // - SpaceDog.normalize.schema.post
  // At the very least, we do parse the json payload returned from XHR

  var defaultNormalizer = function(response){
    console.warn('com.spacedog.tsygan::normalizer->default <<>>', response);
    return response;
  };

  this.normalize = function(url, method, responseText){
    // Urls that come back are fully (FQDN-ed) formed: https://foo.spacedog.io/1/service
    var service = url.split('/')[4].split('?').shift();
    var processor = this.normalize[service] || defaultNormalizer;
    var response = JSON.parse(responseText);
    return (processor[method.toLowerCase()] || processor)(response, url);
  };

}).apply(this.SpaceDog || (this.SpaceDog = {}));
