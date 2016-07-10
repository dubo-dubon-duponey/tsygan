import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:password', 'Unit | Transform | password', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});
