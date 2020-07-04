const UserSchema = require('../models/user');
const baseMethods = require('./base');

module.exports = class UserRepo {
  /**
   * @param {import('../models/user')} schema schema do usuário
   * @param {import('./base')} base métodos base
   */
  constructor(schema = UserSchema, base = baseMethods) {
    this.schema = schema;
    this.base = base;
  }

  async create(data) {
    const {
      password,
      deviceId,
      updatedAt,
      ...user
    } = await this.base.create(data, this.schema);

    return user;
  }

  exists(data) {
    return this.base.exists(data, this.schema);
  }

  findOne(data, projection) {
    return this.base.findOne(data, projection, this.schema);
  }
};
