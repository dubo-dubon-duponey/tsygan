(function(){
  /* eslint strict:0*/
  'use strict';

  // Normalization processes payloads returned by the SpaceDog service into JSONAPI responses
  // It does look up for a specific normalizer, for the "endpoint" (/schema, /share, etc), and
  // the method (GET, PUT, etc).
  // Example: for a POST query to the /1/schema endpoint, the following normalizing functions will be looked-up, and
  // the last existing one will be used:
  // - SpaceDog.normalize
  // - SpaceDog.normalize.schema
  // - SpaceDog.normalize.schema.post

  var defaultNormalizer = function(response){
    throw new Error('Unhandled default normalization for content', response);
  };

  this.normalize = function(url, method, responseText){
    // Urls that come back here are FQDN-ed: https://foo.spacedog.io/1/endpoint, so get the "endpoint" part
    var service = url.split('/')[4].split('?').shift();
    var processor = this.normalize[service] || defaultNormalizer;
    // Parse the payload
    var response = JSON.parse(responseText);
    // Process it
    return (processor[method.toLowerCase()] || processor)(response, url);
  };

}).apply(this.SpaceDog || (this.SpaceDog = {}));
