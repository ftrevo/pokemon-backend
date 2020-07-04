/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { Schema, model, Types: { ObjectId } } = require('mongoose');
const { getToken } = require('../helpers/utils');

const schemaObj = {
  players: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  winner: {
    type: ObjectId,
    ref: 'User',
  },
  maker: {
    type: ObjectId,
    ref: 'User',
  },
  token: {
    type: String,
    default: getToken,
  },
};
const GameSchema = new Schema(
  schemaObj,
  { versionKey: false, timestamps: true, toJSON: { transform: true } },
);

const doTransformation = (isPopulated, field) => {
  if (isPopulated) {
    const { password, ...playerToBeSet } = field;
    return playerToBeSet;
  }
  return field.toString();
};

const transformUser = (document, toBeTransformed, fieldName) => (
  doTransformation(document.populated(fieldName), toBeTransformed[fieldName]));

GameSchema.options.toJSON.transform = (document, toBeTransformed) => {
  const { ...toBeReturned } = toBeTransformed;
  toBeReturned._id = toBeTransformed._id.toString();

  if (toBeTransformed.winner) {
    toBeReturned.winner = transformUser(document, toBeReturned, 'winner');
  }

  if (toBeTransformed.maker) {
    toBeReturned.maker = transformUser(document, toBeReturned, 'maker');
  }

  if (toBeTransformed.players && toBeTransformed.players.length > 0) {
    const populated = document.populated('players');

    toBeReturned.players = toBeTransformed.players.map(
      (player) => (doTransformation(populated, player)),
    );
  }

  return toBeReturned;
};


module.exports = model('Game', GameSchema);
