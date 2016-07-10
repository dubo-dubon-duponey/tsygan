/**
 * Files here have been forked out of jsBoot.
 * (c) Dubo Dubon Duponey under MIT License
 */
(function(){
  'use strict';

    this.uuid = {
      generate: function() {
        console.debug('com.tsygan::generateIdForRecord');
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        });
      }
    };

}).apply(this.SpaceDog || (this.SpaceDog = {}));
