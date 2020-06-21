const validationData = require('../validations');
const validationExecutor = require('../helpers/validator');
const generalUtils = require('../helpers/utils');

module.exports = class Validation {
  constructor(utils = generalUtils, validations = validationData, validator = validationExecutor) {
    this.utils = utils;
    this.validations = validations;
    this.validator = validator;

    // Needs to bind due beeing used as a high order function
    this.outbound = this.outbound.bind(this);
    this.inbound = this.inbound.bind(this);
  }

  outbound(data, response, status = 200) {
    return response
      .status(status)
      .json({
        data: this.validator.execute(response.locals.outputValidation, data, 533),
        ...this.utils.getDefaultResData(response.locals),
      });
  }

  inbound(request, response, next) {
    try {
      const methodRule = this.validations.getRule(request.path, request.method);

      if (methodRule) {
        if (methodRule.params) {
          request.params = this.validator.execute(methodRule.params, request.params);
        }

        if (methodRule.query) {
          request.query = this.validator.execute(methodRule.query, request.query);
        }

        if (methodRule.body) {
          request.body = this.validator.execute(methodRule.body, request.body);
        }

        response.locals.outputValidation = methodRule.out;
      }
      next();
    } catch (error) {
      next(error);
    }
  }
};
