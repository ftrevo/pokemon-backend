const Validation = require('../middlewares/validation');

module.exports = class BaseController {
  /**
   * @param {Function} finish Função que realiza a validação de saída e finaliza a response
   */
  constructor(validation = new Validation()) {
    this.start = validation.inbound;
    this.finish = validation.outbound;
  }
};
