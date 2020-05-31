const bryptjs = require('bcryptjs');
const { findOne } = require('../../repository/user');

/**
 * @param {Object} data Dados da query de existência.
 * @param {String} projection Dados a serem retornados do banco de dados.
 * @param {import('../../repository/user/find-one')} findOneRepo
 * @param {Object} throwIfNotExists Exception em caso de sucesso ou falha.
 * @param {Object} exceptionMsg Mensagem da exception.
 * @returns {Object} Existing user.
 * @throws {Error} Com o texto informado caso throwIfNotExists seja true e a query não retorne nada.
 */
const getOne = async (data, projection, findOneRepo, throwIfNotExists, exceptionMsg) => {
  const existingUser = await findOneRepo(data, projection);

  if (exceptionMsg && (throwIfNotExists && !existingUser)) {
    throw new Error(exceptionMsg);
  }

  return existingUser;
};

/**
 * @param {Object} data Dados da query de existência.
 * @param {String} projection Dados a serem retornados.
 * @returns {Boolean}
 * @throws {Error} Com o texto 'User already exits' caso os dados já existam.
 */
const getUser = (data, projection) => getOne(data, projection, findOne, true, 'User does not exits');

/**
 * @param {Object} data Dados da query de existência.
 * @param {import('bcrypt')} bcrypt Dados a serem retornados.
 * @returns {Object} Existing user
 * @throws {Error} Caso o usuário não exista ou a senha esteja incorreta.
 */
const getUserPwd = async ({ email, password: rawPwd }, bcrypt) => {
  const dbUser = await getOne(
    { email },
    '-deviceToken -updatedAt',
    findOne,
    true,
    'User does not exits',
  );

  const { password: encryptedPwd, ...user } = await dbUser.toJSON();

  const matches = bcrypt.compareSync(rawPwd, encryptedPwd);

  if (!matches) {
    throw new Error('Senha inválida.');
  }

  return user;
};

/**
 * @param {Object} data Dados da query de existência.
 * @returns {Boolean}
 * @throws {Error} Caso o usuário não exista ou a senha esteja incorreta.
 */
const getUserValidPwd = (data) => getUserPwd(data, bryptjs);

module.exports = {
  getOne,
  getUser,
  getUserPwd,
  getUserValidPwd,
};
