const { Schema, model, Types: { ObjectId } } = require('mongoose');

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
    active: [Number],
    bag: [Number],
  },
  starter: Number,
};

const PlayerSchema = new Schema(schemaObj, { versionKey: false, timestamps: true });

module.exports = model('Player', PlayerSchema);
