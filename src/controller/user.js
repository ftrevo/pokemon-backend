const userRules = require('../business-rules/user');
const userRepo = require('../repository/user');
const BaseController = require('./base-controller');

module.exports = class UserController extends BaseController {
  /**
   * @param {import('../repository/user')} repo repository do usuário
   * @param {import('../business-rules/user')} rules rules do usuário
   */
  constructor(repo = userRepo, rules = userRules) {
    super();
    this.repo = repo;
    this.rules = rules;
  }

  async signUp({ body }, response, next) {
    this.rules.exists.signUp({ email: body.email })
      .then(() => this.repo.create(body))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }

  async signIn({ body }, response, next) {
    this.rules.get.getUserValidPwd(body)
      .then(this.rules.sign)
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }
};
