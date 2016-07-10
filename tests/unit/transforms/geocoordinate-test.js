import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:geocoordinate', 'Unit | Transform | geocoordinate', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('undefined is undefined', function(assert) {
  var transform = this.subject();
  ['', 0, -0, false, null, NaN, -NaN, 'string', 1, 1.1, Infinity, -Infinity, true, function(){}, [], {}, {foo: 'bar', 1: 2}, new Date(), new RegExp(), undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, undefined);
    assert.equal(result2, undefined);
  });
});

test('parsing correctly', function(assert) {
  var transform = this.subject();
  [{in: '+90.0, -127.554334', out: {latitude: 90, longitude: -127.554334}},
    {in: '45, 180', out: {latitude: 45, longitude: 180}},
    {in: '-90, -180', out: {latitude: -90, longitude: -180}},
    {in: '-90.000, -180.0000', out: {latitude: -90, longitude: -180}},
    {in: '+90, +180', out: {latitude: 90, longitude: 180}},
    {in: '47.1231231, 179.99999999', out: {latitude: 47.1231231, longitude: 179.99999999}},].forEach(function(item){
    var result1 = transform.deserialize(item.in);
    assert.equal(JSON.stringify(result1), JSON.stringify(item.out));
  });
});
