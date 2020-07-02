const generalRules = require('../business-rules/general');
const BaseController = require('./base-controller');

module.exports = class ServerStatus extends BaseController {
  /**
   * @param {import('../business-rules/general')} generalRules rules gerais
   */
  constructor(rules = generalRules) {
    super();
    this.rules = rules;
  }

  getStatus(request, response, next) {
    return this.start(request, response)
      .then(() => this.rules.status.get())
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }
};
