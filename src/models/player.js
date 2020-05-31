// ----------------- Import de dependências ----------------- //
const { Schema, model, Types: { ObjectId } } = require('mongoose');

const pokeball = {
  pokemonNumber: {
    type: Number,
  },
  evolution: {
    status: {
      type: String,
    },
    previous: [
      {
        type: Number,
      },
    ],
  },
};

const schemaObj = {
  user: {
    type: ObjectId,
    ref: 'User',
  },
  pokemons: {
    active: [
      pokeball,
    ],
    bag: [
      pokeball,
    ],
  },
};

const PlayerSchema = new Schema(schemaObj, { versionKey: false, timestamps: true });

// --------------------- Module Exports --------------------- //
module.exports = model('Player', PlayerSchema);
