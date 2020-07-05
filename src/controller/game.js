/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const BaseController = require('./base-controller');
const gameRules = require('../business-rules/game');
const GameRepo = require('../repository/game');

module.exports = class GameController extends BaseController {
  /**
   * @param {import('../repository/game')} repo repository do jogo
   * @param {import('../business-rules/game')} rules rules do jogo
   */
  constructor(repo = new GameRepo(), rules = gameRules) {
    super();
    this.repo = repo;
    this.rules = rules;
  }

  async create(request, response, next) {
    return this.start(request, response)
      .then(() => this.rules.exists.create(response.locals.user._id))
      .then((maker) => this.repo.create({ maker, users: [maker] }))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }

  async join(request, response, next) {
    return this.start(request, response)
      .then(({ body: { token } }) => this.rules.exists.join(
        { token, user: response.locals.user._id },
      ))
      .then((data) => this.repo.join(data))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }
};
