import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:url', 'Unit | Transform | url', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});
