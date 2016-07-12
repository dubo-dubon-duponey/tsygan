(function(){
  /* eslint strict:0*/
  'use strict';

  var TYPE = 'tsygan@spacedog-share';
  var LOG_PREFIX = 'com.tsygan::normalizer->share::';

  (function(){

    // Shares can be individually posted or deleted, and listed globally

    this.share = function(response){
      throw new Error('Unhandled normalization on share for content', response);
    };

    this.share.delete = function(response, url){
      console.debug(LOG_PREFIX + 'delete <<', response);
      // This is quite unfortunate. Ids have to be rebuilt from normal ids + filename
      var id = url.split('/');
      var filename = decodeURIComponent(id.pop());
      id = id.pop() + '*' + filename;
      var ret = {
        data: {
          id: id,
          type: TYPE
        }
      };
      console.debug(LOG_PREFIX + 'delete >>', ret);
      return ret;
    };

    this.share.get = function(response, url){
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
          var newKey = key.dasherize();
          if (newKey !== key){
            item[newKey] = item[key];
            delete item[key];
          }
        });
        var id = item.path.split('/');
        item.filename = id.pop();
        id = id.pop() + '*' + item.filename;
        output.data.push({
          id: id,
          type: TYPE,
          attributes: item,
          relationships: {}
        });
        // XXX brutal pascal - we need the FQDN in here, so, abuse the base request url
        item.path = url + item.path;
      });
      console.debug(LOG_PREFIX + 'get >>', output);
      return output;
    };

    this.share.put = function(response, url){
      console.debug(LOG_PREFIX + 'put <<', response);
      var id = response.path.split('/');
      var filename = id.pop();
      id = id.pop() + '*' + filename;
      var output = {
        data: {
          id: id,
          type: TYPE,
          attributes: response
        }
      };
      var p = url.split('/');
      p.pop();
      response.path  = p.join('/') + response.path;
      console.debug(LOG_PREFIX + 'put <<', output);
      return output;
    };

  }).apply(this.normalize || (this.normalize = {}));
}).apply(this.SpaceDog || (this.SpaceDog = {}));

