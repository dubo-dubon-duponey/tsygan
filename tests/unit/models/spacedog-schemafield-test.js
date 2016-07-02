import { moduleForModel, test } from 'ember-qunit';

moduleForModel('spacedog-schemafield', 'Unit | Model | spacedog schemafield', {
  // Specify the other units that are required for this test.
  needs: ['model:tsygan@spacedog-schema', 'model:tsygan@spacedog-schemafield']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
