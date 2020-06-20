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
  token: {
    type: String,
  },
  // new uIDGenerator(uIDGenerator.BASE36, 5).generateSync() - MAS USAR COM CRYPTO
};

const GameSchema = new Schema(schemaObj, { versionKey: false, timestamps: true });

module.exports = model('Game', GameSchema);
