const sign = require('./sign');

const UserExists = require('./exists');
const Get = require('./get');

const exists = new UserExists();
const get = new Get();

module.exports = {
  exists,
  get,
  sign,
};
