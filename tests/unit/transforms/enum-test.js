import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:enum', 'Unit | Transform | enum', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('undefined is undefined', function(assert) {
  var transform = this.subject();
  ['', 0, -0, false, null, NaN, -NaN, 'string', 1, 1.1, Infinity, -Infinity, true, function(){}, [], [1, '2'], {}, {foo: 'bar', 1: 2}, new Date(), new RegExp(), undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('valid options', function(assert) {
  var transform = this.subject();
  // XXX NaN, -NaN, is always trouble, (though it works)
  var opts = ['', 0, -0, false, null, 'string', 1, 1.1, Infinity, -Infinity, true, function(){}, [], [1, '2'], {}, {foo: 'bar', 1: 2}, new Date(), new RegExp(), undefined, ];
  opts.forEach(function(item){
    var result1 = transform.deserialize(item, {'enum-set': opts});
    var result2 = transform.serialize(item, {'enum-set': opts});
    assert.equal(result1, item);
    assert.equal(result2, item);
  });
});

