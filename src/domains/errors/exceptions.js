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

class RouteNotFound extends HttpException {
  constructor(message) {
    super(404, message, 'Not Found', true);
  }
}

class ValidationNotFound extends HttpException {
  constructor(message) {
    super(500, message, 'Not Found Validation', true);
  }
}

const getUnprocessable = (message) => new Unprocessable(message);
const getUnauthorized = (message) => new Unauthorized(message);

module.exports = {
  Unprocessable,
  Unauthorized,
  RouteNotFound,
  ValidationNotFound,
  getUnprocessable,
  getUnauthorized,
};
