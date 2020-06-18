// ----------------- Import de dependências ----------------- //
const Joi = require('@hapi/joi');

// --------------- Import de arquivos do core --------------- //
const keys = require('./keys');

const signUpBody = Joi.object().required().keys({
  name: keys.name.required(),
  password: keys.password.required(),
  email: keys.email.required(),
  deviceToken: keys.deviceToken,
}).meta({
  className: 'sign-up-body',
});

const signUpOut = Joi.object().required().keys({
  _id: keys.id.required(),
  name: keys.name.required(),
  email: keys.email.required(),
  createdAt: keys.createdAt.required(),
}).meta({
  className: 'sign-up-out',
});

const signInBody = Joi.object().required().keys({
  email: keys.email.required(),
  password: keys.password.required(),
}).meta({
  className: 'sign-in-body',
});

const signInOut = Joi.object().required().keys({
  token: keys.token.required(),
}).meta({
  className: 'sign-in-out',
});

// --------------------- Module Exports --------------------- //
module.exports = {
  signUpBody,
  signUpOut,
  signInBody,
  signInOut,
};
