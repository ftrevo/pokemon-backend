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

  outbound(data, response, next, status = 200) {
    let toBeReturned;
    try {
      toBeReturned = this.validator.execute(response.locals.outputValidation, data, 533);
    } catch (error) {
      return next(error);
    }

    return response
      .status(status)
      .json({
        data: toBeReturned,
        ...this.utils.getDefaultResData(response.locals),
      });
  }

  inbound(request, response) {
    return new Promise((resolve) => {
      const methodRule = this.validations.getRule(request.path, request.method);

      const validData = {};
      if (methodRule) {
        if (methodRule.params) {
          validData.params = this.validator.execute(methodRule.params, request.params);
        }

        if (methodRule.query) {
          validData.query = this.validator.execute(methodRule.query, request.query);
        }

        if (methodRule.body) {
          validData.body = this.validator.execute(methodRule.body, request.body);
        }

        response.locals.outputValidation = methodRule.out;
      }
      return resolve(validData);
    });
  }
};
