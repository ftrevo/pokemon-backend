const userRules = require('../business-rules/user');
const UserRepo = require('../repository/user');
const BaseController = require('./base-controller');

module.exports = class UserController extends BaseController {
  /**
   * @param {import('../repository/user')} repo repository do usuário
   * @param {import('../business-rules/user')} rules rules do usuário
   */
  constructor(repo = new UserRepo(), rules = userRules) {
    super();
    this.repo = repo;
    this.rules = rules;
  }

  async signUp(request, response, next) {
    return this.start(request, response)
      .then(({ body }) => this.rules.exists.signUp(body))
      .then((userData) => this.repo.create(userData))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }

  async signIn(request, response, next) {
    return this.start(request, response)
      .then((validData) => this.rules.get.getUserValidPwd(validData.body))
      .then((user) => this.rules.sign(user))
      .then((output) => this.finish(output, response))
      .catch(next);
  }
};
