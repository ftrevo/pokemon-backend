/**
 * @param {Object} data Dados do usuario.
 * @param {import('mongoose').Model} model UserSchema object.
 * @returns {Object} Created user sanitized.
 */
const createUser = async (data, model) => {
  const created = await model.create(data);

  const {
    password,
    deviceId,
    updatedAt,
    ...user
  } = await created.toJSON();

  return user;
};

module.exports = createUser;
