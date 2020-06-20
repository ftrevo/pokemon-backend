const validations = require('../validations');
const { execute } = require('../helpers/validator');
const { getDefaultResData, getReplacedRouteString, isSwaggerRoute } = require('../helpers/utils');

const inbound = (request, response, next) => {
  if (!isSwaggerRoute(request.path)) {
    const baseRule = validations[getReplacedRouteString(request.path)];

    const methodRule = baseRule[request.method.toLowerCase()];

    if (!methodRule || !methodRule.out) {
      return response.status(404).send({
        message: 'Requested route was not found at the server',
        ...getDefaultResData(response.locals),
      });
    }

    if (methodRule.params) {
      request.params = execute(methodRule.params, request.params);
    }

    if (methodRule.query) {
      request.query = execute(methodRule.query, request.query);
    }

    if (methodRule.body) {
      request.body = execute(methodRule.body, request.body);
    }

    response.locals.outputValidation = methodRule.out;
  }

  return next();
};

const outbound = (data, response, status = 200) => response
  .status(status)
  .json({
    data: execute(response.locals.outputValidation, data, 533),
    ...getDefaultResData(response.locals),
  });

module.exports = {
  inbound,
  outbound,
};
