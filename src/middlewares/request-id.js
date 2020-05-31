// ----------------- Import de dependências ----------------- //
const { v4 } = require('uuid');

/**
 * @param request {import('express').Request} Request object.
 * @param next {import('express').NextFunction} Next function.
 * @param v4Uuid {import('uuid).v4} V4 Uuid generator.
 */
const internal = (request, next, v4Uuid) => {
  request.requestId = v4Uuid();
  request.currentDate = new Date();
  next();
};

const genIdDate = (req, res, next) => internal(req, next, v4);

// --------------------- Module Exports --------------------- //
module.exports = {
  internal,
  genIdDate,
};
