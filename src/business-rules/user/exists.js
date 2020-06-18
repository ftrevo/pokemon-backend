const userRepo = require('../../repository/user');

const { getUnprocessable } = require('../../domains/errors/exceptions');

module.exports = class Exists {
  /**
   * @param {import('../../repository/user')} repo repository do usuário
   */
  constructor(repo = userRepo) {
    this.repo = repo;

    // Needs to bind due if used as a high order function
    // this.exists = this.exists.bind(this);
    // this.signUp = this.signUp.bind(this);
  }

  async exists(data, throwCondition, exception) {
    const userExists = await this.repo.exists(data);

    if (userExists === throwCondition) {
      throw exception;
    }

    return userExists;
  }

  signUp(data) {
    return this.exists(data, true, getUnprocessable('User already exits'));
  }
};
