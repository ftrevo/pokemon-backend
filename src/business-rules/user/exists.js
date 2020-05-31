const { exists: repoExists } = require('../../repository/user');

/**
 * @param {Object} data Dados da query de existência.
 * @param {Object} thrownOnSucess Exception em caso de sucesso ou falha.
 * @param {import('../../repository/user/check-exists')} userExistsRepo
 * @param {Object} exceptionMsg Mensagem da exception.
 * @returns {Boolean}
 * @throws {Error} Com o texto informado caso thrownOnSucess seja igual ao resultado da query.
 */
const exists = async (data, userExistsRepo, thrownOnSucess, exceptionMsg) => {
  const userExists = await userExistsRepo(data);

  if (exceptionMsg && ((thrownOnSucess && userExists) || (!thrownOnSucess && !userExists))) {
    throw new Error(exceptionMsg);
  }

  return userExists;
};

/**
 * @param {Object} data Dados da query de existência.
 * @returns {Boolean}
 * @throws {Error} Com o texto 'User already exits' caso os dados já existam.
 */
const existsCreate = (data) => exists(data, repoExists, true, 'User already exits');

/**
 * @param {Object} data Dados da query de existência.
 * @returns {Boolean}
 * @throws {Error} Com o texto 'User does not exits' caso os dados não existam.
 */
const existsSignIn = (data) => exists(data, repoExists, false, 'User does not exits');

module.exports = {
  existsCreate,
  existsSignIn,
  exists,
};
