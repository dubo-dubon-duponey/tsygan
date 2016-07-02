(function(){
  'use strict';

  var TYPE = 'tsygan@spacedog-log';
  var LOG_PREFIX = 'com.spacedog.tsygan::normalizer->log::';

  (function(){
    // Logs can't be posted or individually retrieved
    // The only request that ever comes back is from a full search and is an array
    this.log = function(response){
      console.warn(LOG_PREFIX + 'default <<>>', response);
      return response;
    };

    this.log.get = function(response){
      console.debug(LOG_PREFIX + 'get <<', response);
      var output = {
        data: [],
        meta: {
          took: response.took,
          total: response.total
        }
      };
      response.results.forEach(function(item){
        Object.keys(item).forEach(function(key){
          // JSONAPI expects dasherized keys
          var newKey = key.dasherize();
          if(newKey != key){
            item[newKey] = item[key];
            delete item[key];
          }
        });
        output.data.push({
          // Logs don't have identifies on SpacedDog. Hashing the content "works" because of timestamps.
          id: SpaceDog.md5.crypt(JSON.stringify(item)),
          type: TYPE,
          attributes: item,
          relationships: {}
        });
      });
      console.debug(LOG_PREFIX + 'get >>', output);
      return output;
    };

  }).apply(this.normalize || (this.normalize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));
