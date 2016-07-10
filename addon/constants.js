export default {

  // XXX SpaceDog non-iso language list (ES) https://github.com/spacedog-io/services/issues/12
  languages: {
    "Arabic": "arabic",
    "Armenian": "armenian",
    "Basque": "basque",
    "Brazilian": "brazilian",
    "Bulgarian": "bulgarian",
    "Catalan": "catalan",
    "Cjk": "cjk",
    "Czech": "czech",
    "Danish": "danish",
    "Dutch": "dutch",
    "English": "english",
    "Finnish": "finnish",
    "French": "french",
    "Galician": "galician",
    "German": "german",
    "Greek": "greek",
    "Hindi": "hindi",
    "Hungarian": "hungarian",
    "Indonesian": "indonesian",
    "Irish": "irish",
    "Italian": "italian",
    "Latvian": "latvian",
    "Lithuanian": "lithuanian",
    "Norwegian": "norwegian",
    "Persian": "persian",
    "Portuguese": "portuguese",
    "Romanian": "romanian",
    "Russian": "russian",
    "Sorani": "sorani",
    "Spanish": "spanish",
    "Swedish": "swedish",
    "Turkish": "turkish",
    "Thai": "thai"
  },

// Our types on the left, and SpaceDog DSL on the right
  types: {
    "identifier": "string",
    "binary": "string",
    "boolean": "boolean",
    "color": "string",
    "date": "timestamp",
    "email": "string",
    "enum": "enum",
    "geocoordinates": "geopoint",
    "integer": "long",
    "json": "stash",
    "number": "double",
    "password": "string",
    "regexp": "string",
    "string": "text",
    "url": "string",

    // XXX there are currently no notion of reference in SpaceDog. Use identifier instead to store the id of the linked model
    "belongsTo": "string",
    "hasMany": "string"
  }
};
