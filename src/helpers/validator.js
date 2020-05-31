/**
 * Valida o schema com base nos dados. Lança a exception do Joi em caso de problemas
 *
 * @param schema {import('@hapi/joi').Schema} Schema a ser validado.
 * @param {Object} data Objeto a ser validado.
 */
const validate = (schema, data) => {
  const { error, value } = schema.validate(
    data,
    { abortEarly: false, dateFormat: 'iso', stripUnknown: true },
  );

  if (error) {
    console.log(error);
    throw error;
  }

  return value;
};

module.exports = validate;
