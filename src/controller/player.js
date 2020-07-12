/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const BaseController = require('./base-controller');
const playerRules = require('../business-rules/player');
const gameRule = require('../business-rules/game');
const PlayerRepo = require('../repository/player');

module.exports = class PlayerController extends BaseController {
  /**
   * @param {import('../repository/player')} repo repository do jogador
   * @param {import('../business-rules/player')} rules rules do jogador
   * @param {import('../business-rules/game')} gameRule rules do jogo
   */
  constructor(repo = new PlayerRepo(), rules = playerRules, gameRules = gameRule) {
    super();
    this.repo = repo;
    this.rules = rules;
    this.gameRules = gameRules;
  }

  async setUp(request, response, next) {
    return this.start(request, response)
      .then(({ body }) => this.gameRules.exists.byId(body))
      .then((body) => this.rules.exists.create({ user: response.locals.user._id, ...body }))
      .then((player) => this.repo.setUp(player))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }
};
