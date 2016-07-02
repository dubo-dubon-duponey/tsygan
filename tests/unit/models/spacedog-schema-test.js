import { moduleForModel, test } from 'ember-qunit';

moduleForModel('spacedog-schema', 'Unit | Model | spacedog schema', {
  // Specify the other units that are required for this test.
  needs: ['model:tsygan@spacedog-schemafield']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
