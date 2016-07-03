
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

// Our types on the left, and SpaceDog translation on the right
  types: {
    // "Fake" type used internally to force a no-op transform
    "binary": "identifier",

    // These are the only two useful numerical types for us
    "integer": "long",
    "number": "double",

    // This is the only useful time/date type
    "date": "timestamp",

    // Plain indexable text
    "string": "text",

    // Non indexable
    "identifier": "string",
    // "blob": "string",

    // Simple types
    "boolean": "boolean",
    "geocoordinates": "geopoint",

    "enum": "enum",
    "json": "stash",
    "belongsTo": "belongsTo",
    "hasMany": "hasMany"

    // 'ref': 'reference',
    /*,
     'file': 'file',
     'amount': 'amount'
     */
  }

};
