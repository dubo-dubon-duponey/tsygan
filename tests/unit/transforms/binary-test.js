import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:binary', 'Unit | Transform | binary', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('it doesn\'t touch anything', function(assert) {
  var transform = this.subject();
  ['string', '', 0, -0, 1, 1.1, Infinity, -Infinity, false, true, function(){}, null, [], [1, '2'], {}, {foo: 'bar', 1: 2}, new Date(), new RegExp(), undefined, ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, item);
    assert.equal(result2, item);
  });
});
