/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { randomBytes } = require('crypto');
const { Schema, model, Types: { ObjectId } } = require('mongoose');

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
    default: () => ([
      randomBytes(2).toString('hex'),
      '-',
      randomBytes(2).toString('hex'),
      '-',
      randomBytes(2).toString('hex'),
    ].join('')),
  },
};
const GameSchema = new Schema(
  schemaObj,
  { versionKey: false, timestamps: true, toJSON: { transform: true } },
);

GameSchema.options.toJSON.transform = (document, toBeTransformed) => {
  const { ...toBeReturned } = toBeTransformed;
  toBeReturned._id = toBeTransformed._id.toString();

  if (toBeTransformed.winner) {
    if (document.populated('winner')) {
      const { password, ...playerToBeSet } = toBeTransformed.winner;
      toBeReturned.winner = playerToBeSet;
    } else {
      toBeReturned.winner = toBeTransformed.winner.toString();
    }
  }

  if (toBeTransformed.maker) {
    if (document.populated('maker')) {
      const { password, ...playerToBeSet } = toBeTransformed.maker;
      toBeReturned.maker = playerToBeSet;
    } else {
      toBeReturned.maker = toBeTransformed.maker.toString();
    }
  }

  if (toBeTransformed.players && toBeTransformed.players.length > 0) {
    const populated = document.populated('players');

    toBeReturned.players = toBeTransformed.players.map(
      (player) => {
        if (populated) {
          const { password, ...playerToBeReturned } = player;
          return playerToBeReturned;
        }
        return player.toString();
      },
    );
  }


  return toBeReturned;
};


module.exports = model('Game', GameSchema);
