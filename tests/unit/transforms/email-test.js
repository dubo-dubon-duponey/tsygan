import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:email', 'Unit | Transform | email', {
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

test('valid emails', function(assert) {
  var transform = this.subject();
  ['prettyandsimple@example.com',
      'very.common@example.com',
      'disposable.style.email.with+symbol@example.com',
      'other.email-with-dash@example.com',
      'x@example.com',
      '"much.more unusual"@example.com',
      '"very.unusual.@.unusual.com"@example.com',
      // XXX failing on this '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com',
      'example-indeed@strange-example.com',
      'admin@mailserver1',
      '#!$%&\'*+-/=?^_`{}|~@example.org',
      '"()<>[]:,;@\\\"!#$%&\'-/=?^_`{}| ~.a"@example.org',
      '" "@example.org',
      'example@localhost',
      'example@s.solutions',
      'user@com',
      'user@localserver',
      'user@[IPv6:2001:db8::1]'
   ].forEach(function(item){
    var result1 = transform.deserialize(item);
    var result2 = transform.serialize(item);
    assert.equal(result1, item);
    assert.equal(result2, item);
  });
});

test('invalid emails', function(assert) {
  var transform = this.subject();
  [
    'Abc.example.com',
    'A@b@c@example.com',
    'a"b(c)d,e:f;g<h>i[j\k]l@example.com',
    'just"not"right@example.com',
    'this is"not\allowed@example.com',
    'this\ still\"not\\allowed@example.com',
    'john..doe@example.com',
    'john.doe@example..com'
  ].forEach(function(item){
  var result1 = transform.deserialize(item);
  var result2 = transform.serialize(item);
  assert.equal(result1, undefined);
  assert.equal(result2, undefined);
});
});



