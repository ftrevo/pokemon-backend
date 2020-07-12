/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { Schema, model, Types: { ObjectId } } = require('mongoose');
const { transformUser } = require('../helpers/utils');

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
  starterPokemon: Number,
  starterChanged: {
    type: Boolean,
    default: false,
  },
};

const PlayerSchema = new Schema(
  schemaObj,
  { versionKey: false, timestamps: true, toJSON: { transform: true } },
);

PlayerSchema.options.toJSON.transform = (document, toBeTransformed) => {
  const { ...toBeReturned } = toBeTransformed;
  toBeReturned._id = toBeTransformed._id.toString();

  toBeReturned.user = transformUser(document, toBeReturned, 'user');

  if (!document.populated('game')) {
    toBeReturned.game = toBeTransformed.game.toString();
  }

  return toBeReturned;
};

module.exports = model('Player', PlayerSchema);
