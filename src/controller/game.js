/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const BaseController = require('./base-controller');
const gameRules = require('../business-rules/game');
const gameRepo = require('../repository/game');

module.exports = class GameController extends BaseController {
  /**
   * @param {import('../repository/game')} repo repository do jogo
   * @param {import('../business-rules/game')} rules rules do jogo
   */
  constructor(repo = gameRepo, rules = gameRules) {
    super();
    this.repo = repo;
    this.rules = rules;
  }

  async create(request, response, next) {
    this.rules.exists.create({ maker: response.locals.user._id })
      .then(() => this.repo.create({
        maker: response.locals.user._id,
        players: [response.locals.user._id],
      }))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }
};
