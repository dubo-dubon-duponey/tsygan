import { moduleForModel, test } from 'ember-qunit';

moduleForModel('spacedog-schema', 'Unit | Serializer | spacedog schema', {
  // Specify the other units that are required for this test.
  needs: ['serializer:spacedog-schema', 'model:tsygan@spacedog-schemafield']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
