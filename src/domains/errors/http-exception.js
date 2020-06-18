module.exports = class HttpException extends Error {
  constructor(statusCode, message, name = 'HttpException', isBusiness = false) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.name = name;
    this.isBusiness = isBusiness;
  }
};
