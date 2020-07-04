const UserSchema = require('../../models/user');

const createBase = require('../create');
const existsBase = require('../check-exists');
const findOneBase = require('../find-one');

module.exports = class UserRepo {
  /**
   * @param {import('../../models/user')} schema schema do usuário
   */
  constructor(schema = UserSchema) {
    this.schema = schema;
  }

  async create(data) {
    const {
      password,
      deviceId,
      updatedAt,
      ...user
    } = await createBase(data, this.schema);

    return user;
  }

  exists(data) {
    return existsBase(data, this.schema);
  }

  findOne(data, projection) {
    return findOneBase(data, projection, this.schema);
  }
};
