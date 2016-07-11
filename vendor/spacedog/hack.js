(function(){
  'use strict';

  // This is a hack / helper to get back schemas at app initialization time
  this.boot = function (domain, success, failure) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (/*event*/) {
      if (xhr.readyState !== 4)
        return;

      if (xhr.status === 200)
        return success(xhr.responseText);
      failure(xhr);
    };

    xhr.open('GET', 'https://' + domain + '.spacedog.io/1/schema', true);
    xhr.send();
  };

}).apply(this.SpaceDog || (this.SpaceDog = {}));
