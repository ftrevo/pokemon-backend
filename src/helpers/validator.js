const language = require('./joi-pt-messages');

const options = {
  abortEarly: false,
  dateFormat: 'iso',
  stripUnknown: true,
  messages: language,
};

/**
 * Valida o schema com base nos dados. Lança a exception do Joi em caso de problemas
 *
 * @param schema {import('@hapi/joi').Schema} Schema a ser validado.
 * @param {Object} data Objeto a ser validado.
 * @param {Number} errorCode Código http do erro.
 */
const execute = (schema, data, errorCode = 400) => {
  const { error, value } = schema.validate(
    data,
    options,
  );

  if (error) {
    error.statusCode = errorCode;
    error.isBusiness = errorCode >= 400 && errorCode <= 499;
    throw error;
  }

  return value;
};

module.exports = {
  execute,
  options,
};
