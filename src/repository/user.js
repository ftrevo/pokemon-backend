const BaseRepo = require('./base-repository');
const userModel = require('../models/user');

module.exports = class UserRepo extends BaseRepo {
  /**
   * @param {import('../models/user')} model model do usuário
   */
  constructor(model = userModel) {
    super(model);
  }

  async create(data) {
    const {
      password,
      deviceId,
      updatedAt,
      ...user
    } = await super.create(data);

    return user;
  }
};
