const sign = require('./sign');

const Exists = require('./exists');
const Get = require('./get');

const exists = new Exists();
const get = new Get();

module.exports = {
  exists,
  get,
  sign,
};
