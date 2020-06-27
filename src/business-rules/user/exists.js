const BaseExists = require('../exists');
const userRepo = require('../../repository/user');

const { getUnprocessable } = require('../../domains/errors/exceptions');

module.exports = class UserExists extends BaseExists {
  /**
   * @param {import('../../repository/user')} repo repository do usuário
   */
  constructor(repo = userRepo) {
    super(repo);
  }

  async signUp(data) {
    return this.exists(data, true, getUnprocessable('Usuário(a) já existente'));
  }
};
