// ----------------- Import de dependências ----------------- //
const Joi = require('@hapi/joi');

// --------------- Import de arquivos do core --------------- //
const keys = require('./keys');

const userCreateIn = Joi.object().required().keys({
  name: keys.name.required(),
  password: keys.password.required(),
  email: keys.email.required(),
  deviceToken: keys.deviceToken,
}).meta({
  className: 'user-create-in',
});

const userCreateOut = Joi.object().required().keys({
  _id: keys.id.required(),
  name: keys.name.required(),
  email: keys.email.required(),
  createdAt: keys.createdAt.required(),
}).meta({
  className: 'user-create-out',
});

const userSignInIn = Joi.object().required().keys({
  email: keys.email.required(),
  password: keys.password.required(),
}).meta({
  className: 'user-sign-in-in',
});

const userSignInOut = keys.token.required()
  .meta({
    className: 'user-sign-in-out',
  });

// --------------------- Module Exports --------------------- //
module.exports = {
  userCreateIn,
  userCreateOut,
  userSignInIn,
  userSignInOut,
};
