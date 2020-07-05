/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { Schema, model, Types: { ObjectId } } = require('mongoose');
const { getToken } = require('../helpers/utils');

const schemaObj = {
  users: [
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
    const { password, ...userToBeSet } = field;
    return userToBeSet;
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

  if (toBeTransformed.users && toBeTransformed.users.length > 0) {
    const populated = document.populated('users');

    toBeReturned.users = toBeTransformed.users.map(
      (user) => (doTransformation(populated, user)),
    );
  }

  return toBeReturned;
};


module.exports = model('Game', GameSchema);
