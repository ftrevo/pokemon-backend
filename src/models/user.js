/* eslint-disable no-underscore-dangle */
const { Schema, model } = require('mongoose');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');

const schemaObj = {
  name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    index: { unique: true },
  },
  deviceToken: {
    type: String,
    trim: true,
    index: true,
  },
};

const UserSchema = new Schema(
  schemaObj,
  { versionKey: false, timestamps: true, toJSON: { transform: true } },
);

UserSchema.options.toJSON.transform = (document, transformed) => {
  const { ...toBeReturned } = transformed;
  toBeReturned._id = transformed._id.toString();
  return toBeReturned;
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = genSaltSync(12);

  user.password = hashSync(user.password, salt);

  return next();
});

UserSchema.methods.comparePwd = function (candidatePassword) {
  return compareSync(candidatePassword, this.password);
};

module.exports = model('User', UserSchema);
