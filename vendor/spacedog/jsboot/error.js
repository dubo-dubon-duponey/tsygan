/**
 * Files here have been forked out of jsBoot.
 * (c) Dubo Dubon Duponey under MIT License
 */
(function(){
  /*globals Error: false, printStackTrace:false */
  'use strict';

  // Possibly pb related to X-Domain limitation shit
  this.Error = function(name, message) {
    // Error behavior is strange...
    var b = Error.apply(this, [message]);
    // Not too sure this leads anywhere safe though (google fux...)
    if (this === window || this === undefined)
      return;
    this.message = b.message;
    this.stack = b.stack;
    this.name = name;
    if (!this.stack)
      this.stack = typeof printStackTrace !== 'undefined' ? printStackTrace() : [];
  };

  this.Error.prototype = Object.create(Error.prototype, {
    NOT_IMPLEMENTED:    {writable: false, configurable: false, value: 1},
    UNSPECIFIED:        {writable: false, configurable: false, value: 2},
    NOT_INITIALIZED:    {writable: false, configurable: false, value: 4},
    WRONG_ARGUMENTS:    {writable: false, configurable: false, value: 8},
    UNSUPPORTED:        {writable: false, configurable: false, value: 16},
    NATURAL_BORN_CRASH: {writable: false, configurable: false, value: 32}
  });

/*  Object.getOwnPropertyNames(Error.prototype).forEach(function(i) {
    if (i !== 'constructor')
      this.Error.prototype[i] = Error.prototype[i];
  }, this);

  ['NOT_IMPLEMENTED', 'UNSPECIFIED', 'NOT_INITIALIZED', 'WRONG_ARGUMENTS',
    'UNSUPPORTED', 'NATURAL_BORN_CRASH'].forEach(function(item, idx) {
    this.Error[item] = this.Error.prototype[item] = idx;
  }, this);*/

  this.Error.prototype.toString = function() {
    return this.name + ': ' + this.message + '\nStack: ' +
      (Array.prototype.isPrototypeOf(this.stack) ? this.stack.join('\n') : this.stack);
  };

}).apply(this.SpaceDog || (this.SpaceDog = {}));
