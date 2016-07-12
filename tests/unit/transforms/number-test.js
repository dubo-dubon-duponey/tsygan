/* eslint comma-dangle:0 */
import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:number', 'Unit | Transform | number', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('undefined is undefined', function(assert) {
  var transform = this.subject();
  ['', false, null, NaN, -NaN, 'string', true, function(){}, [], {}, {foo: 'bar', 1: 2}, new Date(), new RegExp(),
    undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('ok stuff', function(assert) {
  var transform = this.subject();
  [1.2, [1.2, '2'], '1.2', '1.2FOO'].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, 1.2);
    assert.equal(result2, 1.2);
  });
});

test('ok stuff as well', function(assert) {
  var transform = this.subject();
  [Infinity, -Infinity, 0, -0].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, item);
    assert.equal(result2, item);
  });
});

test('it does honor all coercing options', function(assert) {
  var transform = this.subject();
  var result = transform.deserialize('1234.1', {lt: 1235.1});
  assert.equal(result, 1234.1);
  result = transform.deserialize('1234.1', {lt: 1234.1});
  assert.equal(result, undefined);
  result = transform.deserialize('1234.1', {gt: 1233.1});
  assert.equal(result, 1234.1);
  result = transform.deserialize('1234.1', {gt: 1234.1});
  assert.equal(result, undefined);
  result = transform.deserialize('1234.1', {lte: 1234.1});
  assert.equal(result, 1234.1);
  result = transform.deserialize('1234.1', {lte: 1233.1});
  assert.equal(result, undefined);
  result = transform.deserialize('1234.1', {gte: 1234.1});
  assert.equal(result, 1234.1);
  result = transform.deserialize('1234.1', {gte: 1235.1});
  assert.equal(result, undefined);
  result = transform.deserialize('1234.1', {gte: 1224.1, step: 10});
  assert.equal(result, 1234.1);
  result = transform.deserialize('1234.1', {gte: 1224.1, step: 9});
  assert.equal(result, undefined);
});


