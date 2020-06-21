const Validation = require('../middlewares/validation');

module.exports = class BaseController {
  /**
   * @param {Function} finish Função que realiza a validação de saída e finaliza a response
   */
  constructor(finish = new Validation().outbound) {
    this.finish = finish;
  }
};
