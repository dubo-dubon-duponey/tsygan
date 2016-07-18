export function initialize(application) {
  console.debug('com.tsygan::instance-initializer::model-user <<');

  var store = application.lookup('service:store');

  // XXX this depends on backend schemas to be there already
  var userSchema = store.peekRecord('tsygan@spacedog-schema', 'user');
  if (userSchema) {
    var schemaFields = userSchema.get('fields');
    if (!schemaFields.findBy('name', 'password'))
      schemaFields.pushObject(store.createRecord('tsygan@spacedog-schemafield', {
        name: 'password',
        type: 'password',
        _spacetypehard: 'string',
        // Minimum six characters
        pattern: /.{6,}/,
        required: false,
        parentModel: userSchema
      }));
    if (!schemaFields.findBy('name', 'passwordResetCode'))
      schemaFields.pushObject(store.createRecord('tsygan@spacedog-schemafield', {
        name: 'passwordResetCode',
        type: 'identifier',
        system: true,
        _spacetypehard: 'string',
        required: false,
        parentModel: userSchema
      }));
    if (!schemaFields.findBy('name', 'username'))
      schemaFields.pushObject(store.createRecord('tsygan@spacedog-schemafield', {
        name: 'username',
        type: 'identifier',
        // Minimum three characters, starting with a letter
        pattern: /[a-zA-Z].{2,}/,
        _spacetypehard: 'string',
        required: true,
        parentModel: userSchema
      }));
    if (!schemaFields.findBy('name', 'email'))
      schemaFields.pushObject(store.createRecord('tsygan@spacedog-schemafield', {
        name: 'email',
        type: 'email',
        _spacetypehard: 'string',
        required: true,
        parentModel: userSchema
      }));
    console.debug('com.tsygan::instance-initializer::model-user >> overloadied user schema');
    return;
  }
  console.debug('com.tsygan::instance-initializer::model-user >> nothing to do');
}

export default {
  name: 'model-user',
  before: 'tsygan',
  initialize
};
