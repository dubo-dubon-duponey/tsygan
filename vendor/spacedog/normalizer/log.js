(function(){
  /* global SpaceDog:false */
  'use strict';

  var TYPE = 'tsygan@spacedog-log';
  var LOG_PREFIX = 'com.tsygan::normalizer->log::';

  // Logs can't be posted or individually retrieved
  // The only request that ever comes back is from a full search and is an array

  (function(){
    this.log = function(response){
      throw new Error('Unhandled normalization on log for content', response);
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
          // Dasherise keys if need be
          var newKey = key.dasherize();
          if(newKey !== key){
            item[newKey] = item[key];
            delete item[key];
          }
        });
        output.data.push({
          // Logs don't have ids on SpacedDog. Hashing the content is safe because it contains timestamps.
          id: SpaceDog.md5.crypt(JSON.stringify(item)),
          type: TYPE,
          attributes: item,
          relationships: {}
        });
        // XXX SpaceDog https://github.com/spacedog-io/services/issues/40
        // Anonymous access is logged as "KEY" and empty credential
        if (item.credentials.type === 'KEY' && !item.credentials.name){
          item.credentials.type = 'ANONYMOUS';
        }
        // Process headers, if any
        if (!item.headers)
          return;
        // XXX SpaceDog https://github.com/spacedog-io/services/issues/47
        // Headers key are not normalized, so, normalize them
        Object.keys(item.headers).forEach(function(key){
          var nk = key.toLowerCase().capitalize();
          if( nk === key)
            return;
          item.headers[nk] = item.headers[key];
          delete item.headers[key];
        });
        // Process user-agent, if it's there
        if (!item.headers['User-agent'])
          return;
        // XXX SpaceDog https://github.com/spacedog-io/services/issues/45
        // User-agent may be presented as a coma-split array, so, join back
        if(item.headers['User-agent'].join)
          item.headers['User-agent'] = item.headers['User-agent'].join(',');
      });
      console.debug(LOG_PREFIX + 'get >>', output);
      return output;
    };

  }).apply(this.normalize || (this.normalize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));
