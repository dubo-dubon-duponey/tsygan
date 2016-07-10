import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:identifier', 'Unit | Transform | identifier', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});


test('undefined is undefined', function(assert) {
  var transform = this.subject();
  ['', 0, -0, false, null, NaN, -NaN, undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});


test('weird but valid identifiers', function(assert) {
  var transform = this.subject();
  [1, 1.1, Infinity, -Infinity, 'string', true, function(){}, [], [1, '2'], {}, {foo: 'bar', 1: 2}, new Date(), new RegExp()].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, String(item));
    assert.equal(result2, String(item));
  });
});


test('obey pattern matching', function(assert) {
  var transform = this.subject();
  ['abcdef'].forEach(function(item){
    var result1 = transform.deserialize(item, {pattern: '^[a-z]+$'});
    var result2 = transform.serialize(item, {pattern: '^[a-z]+$'});
    assert.equal(result1, String(item));
    assert.equal(result2, String(item));
  });
  ['A', '1'].forEach(function(item){
    var result1 = transform.deserialize(item, {pattern: '^[a-z]+$'});
    var result2 = transform.serialize(item, {pattern: '^[a-z]+$'});
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});
