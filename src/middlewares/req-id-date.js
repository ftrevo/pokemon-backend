const { v1 } = require('uuid');

/**
 * @param response {import('express').Response} Request object.
 * @param next {import('express').NextFunction} Next function.
 * @param v1Uuid {import('uuid).v1} V1 Uuid generator.
 */
const internal = (response, next, v1Uuid) => {
  response.locals.requestId = v1Uuid();
  response.locals.inboundTime = new Date();

  next();
};

const genIdDate = (req, res, next) => internal(res, next, v1);

module.exports = {
  internal,
  genIdDate,
};
