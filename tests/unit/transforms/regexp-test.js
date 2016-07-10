import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:regexp', 'Unit | Transform | regexp', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});
