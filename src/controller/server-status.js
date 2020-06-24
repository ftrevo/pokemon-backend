const utilRules = require('../business-rules/utils');
const BaseController = require('./base-controller');

module.exports = class ServerStatus extends BaseController {
  /**
   * @param {import('../business-rules/utils/server-status')} utilRules rules do server status
   */
  constructor(rules = utilRules) {
    super();
    this.rules = rules;
  }

  getStatus(request, response, next) {
    return this.rules.status.get()
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }
};
