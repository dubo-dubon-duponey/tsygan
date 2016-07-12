/* eslint comma-dangle:0 */
import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:boolean', 'Unit | Transform | boolean', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('false is false', function(assert) {
  var transform = this.subject();
  ['', 0, -0, false, null, NaN, -NaN].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, false);
    assert.equal(result2, false);
  });
});

test('undefined is undefined', function(assert) {
  var transform = this.subject();
  [undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('true is true', function(assert) {
  var transform = this.subject();
  ['string', 1, 1.1, Infinity, -Infinity, true, function(){}, [], [1, '2'], {}, {foo: 'bar', 1: 2}, new Date(),
    new RegExp()].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, true);
    assert.equal(result2, true);
  });
});
