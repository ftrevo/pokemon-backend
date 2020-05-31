// ----------------- Import de dependências ----------------- //
const Joi = require('@hapi/joi');

const keys = {
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).trim(),
  name: Joi.string().trim(),
  password: Joi.string().trim().min(4),
  email: Joi.string().trim(),
  deviceToken: Joi.string().trim(),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  token: Joi.object({
    type: Joi.string(),
    value: Joi.string(),
  }),
};

// --------------------- Module Exports --------------------- //
module.exports = keys;
