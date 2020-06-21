const { v1 } = require('uuid');

const genIdDate = (request, response, next) => {
  response.locals.requestId = v1();
  response.locals.inboundTime = new Date();

  next();
};

module.exports = {
  genIdDate,
};
