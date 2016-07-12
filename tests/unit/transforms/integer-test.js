/* eslint comma-dangle:0 */
import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:integer', 'Unit | Transform | integer', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('undefined is undefined', function(assert) {
  var transform = this.subject();
  ['', false, null, NaN, -NaN, 'string-1234', Infinity, -Infinity, true, function(){}, [], {}, {foo: 'bar', 1: 2},
    new Date(), new RegExp(), undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('it does serialize & deserialize as expected (single values, no options)', function(assert) {
  var transform = this.subject();
  var result = transform.deserialize('1234');
  assert.equal(result, 1234);

  result = transform.deserialize('1234.123');
  assert.equal(result, 1234);

  result = transform.deserialize('1234foo');
  assert.equal(result, 1234);

  result = transform.deserialize('0x1234');
  assert.equal(result, 0);

  result = transform.deserialize(1234);
  assert.equal(result, 1234);

  result = transform.deserialize(0x1234);
  assert.equal(result, 4660);

  result = transform.deserialize('-1234');
  assert.equal(result, -1234);

  result = transform.deserialize('-0');
  assert.equal(result, 0);

  result = transform.deserialize([1, '2']);
  assert.equal(result, 1);
});

test('it does honor all coercing options', function(assert) {
  var transform = this.subject();
  var result = transform.deserialize('1234', {lt: 1235});
  assert.equal(result, 1234);
  result = transform.deserialize('1234', {lt: 1234});
  assert.equal(result, undefined);
  result = transform.deserialize('1234', {gt: 1233});
  assert.equal(result, 1234);
  result = transform.deserialize('1234', {gt: 1234});
  assert.equal(result, undefined);
  result = transform.deserialize('1234', {lte: 1234});
  assert.equal(result, 1234);
  result = transform.deserialize('1234', {lte: 1233});
  assert.equal(result, undefined);
  result = transform.deserialize('1234', {gte: 1234});
  assert.equal(result, 1234);
  result = transform.deserialize('1234', {gte: 1235});
  assert.equal(result, undefined);
  result = transform.deserialize('1234', {gte: 1224, step: 10});
  assert.equal(result, 1234);
  result = transform.deserialize('1234', {gte: 1224, step: 9});
  assert.equal(result, undefined);
});



test('it does handle options "required" like a boss', function(assert) {
  var options = {
    required: true
  };
  var transform = this.subject();

  // Work with usual values
  var result = transform.deserialize('1234', options);
  assert.equal(result, 1234);

  // Fail if unparsable
  try {
    result = transform.deserialize(Infinity, options);
  } catch (e){
    assert.equal(e.name, SpaceDog.Error.NOT_INITIALIZED);
  }

  result = transform.deserialize(Infinity, {required: true, 'default-value': 254});
  assert.equal(result, 254);

});

test('works with array just the same', function(assert) {
  var transform = this.subject();
  var result = transform.deserialize(['1234', '5678.9', '1234FOO', '0x1234', undefined, 'foo'], {array: true});
  assert.equal(result[0], 1234);
  assert.equal(result[1], 5678);
  assert.equal(result[2], 1234);
  assert.equal(result[3], 0);
  assert.equal(result[4], undefined);
  assert.equal(result[5], undefined);

  result = transform.deserialize(undefined, {array: true});
  assert.equal(result, undefined);

  try {
    result = transform.deserialize(undefined, {array: true, required: true});
  } catch (e){
    assert.equal(e.name, SpaceDog.Error.NOT_INITIALIZED);
  }

});
