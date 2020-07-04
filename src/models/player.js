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
  game: {
    type: ObjectId,
    ref: 'Game',
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

module.exports = model('Player', PlayerSchema);
