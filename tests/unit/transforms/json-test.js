import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:json', 'Unit | Transform | json', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});

// No test here
