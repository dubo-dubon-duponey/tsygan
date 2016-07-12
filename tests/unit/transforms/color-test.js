/* eslint comma-dangle:0 */
import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:color', 'Unit | Transform | color', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('bogus is undefined', function(assert) {
  var transform = this.subject();
  [1, 1.1, {}, {foo: 'bar', 1: 2}, new Date(), new RegExp(), function(){}, Infinity, -Infinity, true, 'string',
    '', 0, -0, false, null, NaN, -NaN, undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('bogus does not deserialize', function(assert) {
  var transform = this.subject();
  [[], [1, '2']].forEach(function(item){
    var result1 = transform.deserialize(item);
    assert.equal(result1, undefined);
  });
});

test('valid serializations', function(assert) {
  var transform = this.subject();
  [ {entry: [], output: 'rgba ()'},
    {entry: [1, 'foo', undefined, ], output: 'rgba (1,foo,)'},
    {entry: [1.1, 2, 3, 5], output: 'rgba (1.1,2,3,5)'}].forEach(function(item){
    var result1 = transform.serialize(item.entry);
    assert.equal(result1, item.output);
  });
});

test('valid deserializations', function(assert) {
  var transform = this.subject();
  [
    {entry: 'rgb(1,2,3)', output: [1, 2, 3, 1]},
    {entry: 'rgba(1,2,3,0.5)', output: [1, 2, 3, 0.5]},
    {entry: '#fff', output: [255, 255, 255, 1]},
    {entry: '#ff0011', output: [255, 0, 17, 1]},
    {entry: 'slateblue', output: [106,90,205,1]},
    {entry: 'hsla(900, 15%, 90%, 0.5)', output: [226,233,233,0.5]},
    {entry: 'hsl(900, 15%, 90%)', output: [226,233,233,1]},
    {entry: 'hsl(900, 0.15, 90%)', output: [226,233,233,1]}
  ].forEach(function(item){
    var result1 = transform.deserialize(item.entry);
    assert.equal(String(result1), String(item.output));
  });
});

