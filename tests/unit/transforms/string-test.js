import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:string', 'Unit | Transform | string', {
  needs: ['transform:tsygan']
});

test('it exists', function(assert) {
  let transform = this.subject();
  assert.ok(transform);
});
