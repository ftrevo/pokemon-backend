/* eslint-disable max-classes-per-file */
const HttpException = require('./http-exception');

class Unprocessable extends HttpException {
  constructor(message) {
    super(422, message, 'Unprocessable', true);
  }
}

class Unauthorized extends HttpException {
  constructor(message) {
    super(401, message, 'Unauthorized', true);
  }
}

const getUnprocessable = (message) => new Unprocessable(message);
const getUnauthorized = (message) => new Unauthorized(message);

module.exports = {
  Unprocessable,
  Unauthorized,
  getUnprocessable,
  getUnauthorized,
};
