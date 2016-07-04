/* global SpaceDog:false */
import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:integer', 'Unit | Transform | integer', {
  // Specify the other units that are required for this test.
  needs: ['transform:tsygan']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('it does serialize & deserialize as expected (single values, no options)', function(assert) {
  var transform = this.subject();
  var result = transform.deserialize("1234");
  assert.equal(result, 1234);

  result = transform.deserialize("1234.123");
  assert.equal(result, 1234);

  result = transform.deserialize("1234foo");
  assert.equal(result, 1234);

  result = transform.deserialize("0x1234");
  assert.equal(result, 0);

  result = transform.deserialize(1234);
  assert.equal(result, 1234);

  result = transform.deserialize(0x1234);
  assert.equal(result, 4660);

  result = transform.deserialize(Infinity);
  assert.equal(result, undefined);

  result = transform.deserialize(-Infinity);
  assert.equal(result, undefined);

  result = transform.deserialize("-1234");
  assert.equal(result, -1234);

  result = transform.deserialize("foobar-1234");
  assert.equal(result, undefined);
});

test('it does handle options "required" like a boss', function(assert) {
  var options = {
    required: true
  };
  var transform = this.subject();

  // Work with usual values
  var result = transform.deserialize("1234", options);
  assert.equal(result, 1234);

  // Fail if unparsable
  try{
    result = transform.deserialize(Infinity, options);
  }catch(e){
    assert.equal(e.name, SpaceDog.Error.NOT_INITIALIZED);
  }

  result = transform.deserialize(Infinity, {required: true, 'default-value': 254});
  assert.equal(result, 254);

});

test('works with array just the same', function(assert) {
  var transform = this.subject();
  var result = transform.deserialize(["1234", "5678.9", "1234FOO", "0x1234", undefined, "foo"], {array: true});
  assert.equal(result[0], 1234);
  assert.equal(result[1], 5678);
  assert.equal(result[2], 1234);
  assert.equal(result[3], 0);
  assert.equal(result[4], undefined);
  assert.equal(result[5], undefined);

  result = transform.deserialize(undefined, {array: true});
  assert.equal(result, undefined);

  try{
    result = transform.deserialize(undefined, {array: true, required: true});
  }catch(e){
    assert.equal(e.name, SpaceDog.Error.NOT_INITIALIZED);
  }

});
