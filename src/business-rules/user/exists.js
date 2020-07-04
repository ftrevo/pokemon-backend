const BaseExists = require('../exists');
const UserRepo = require('../../repository/user');

const { getUnprocessable } = require('../../domains/errors/exceptions');

module.exports = class UserExists extends BaseExists {
  /**
   * @param {import('../../repository/user')} repo repository do usuário
   */
  constructor(repo = new UserRepo()) {
    super(repo);
  }

  async signUp(userData) {
    await super.exists({ email: userData.email }, true, getUnprocessable('Usuário(a) já existente'));
    return userData;
  }
};
