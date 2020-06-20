const userRepo = require('../../repository/user');

const { getUnauthorized } = require('../../domains/errors/exceptions');

module.exports = class Get {
  /**
   * @param {import('../../repository/user')} repo repository do usuário
   */
  constructor(repo = userRepo) {
    this.repo = repo;
  }

  async getUserValidPwd({ email, password: rawPwd }) {
    const existingUser = await this.repo.findOne({ email }, '-deviceToken -updatedAt');

    if (!existingUser) {
      throw getUnauthorized('Usuário(a) e/ou senha invalido(a)');
    }

    const matches = existingUser.comparePwd(rawPwd);

    if (!matches) {
      throw getUnauthorized('Usuário(a) e/ou senha invalido(a)');
    }
    const { password, ...user } = existingUser.toJSON();

    return user;
  }
};
