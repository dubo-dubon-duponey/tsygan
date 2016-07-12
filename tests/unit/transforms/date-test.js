/* eslint comma-dangle:0 */
import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:date', 'Unit | Transform | date', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('undefined is undefined', function(assert) {
  var transform = this.subject();
  ['string', '', NaN, -NaN, Infinity, -Infinity, [], function(){}, new RegExp(), {}, {foo: 'bar', 1: 2},
    undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('weird but can deserialize', function(assert) {
  var transform = this.subject();
  [1, 1.1, true, 0, -0, false, null, [1, '2']].forEach(function(item){
    var result1 = transform.deserialize(item);
    assert.equal(result1.toISOString(), new Date(item).toISOString());
  });
});


test('weird but can serialize', function(assert) {
  var transform = this.subject();
  [1, 1.1, true, 0, -0, false, null, [1, '2']].forEach(function(item){
    var result1 = transform.serialize(item);
    assert.equal(result1, new Date(item).toISOString());
  });
});

test('valid stuff that will serialize', function(assert) {
  var transform = this.subject();
  [new Date()].forEach(function(item){
    var result2 = transform.serialize(item);
    assert.equal(result2, item.toISOString());
  });
});

test('valid stuff that will deserialize', function(assert) {
  var transform = this.subject();
  ['2016-07-09T23:05:43.097Z'].forEach(function(item){
    var result1 = transform.deserialize(item);
    assert.equal(result1.toISOString(), item);
  });
});
