/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const BaseController = require('./base-controller');
const pRule = require('../business-rules/player');
const gRule = require('../business-rules/game');
const pkmRule = require('../business-rules/pokemon');
const PlayerRepo = require('../repository/player');

module.exports = class PlayerController extends BaseController {
  /**
   * @param {import('../repository/player')} repo repository do jogador
   * @param {import('../business-rules/player')} rules rules do jogador
   * @param {import('../business-rules/game')} gameRules rules do jogo
   * @param {import('../business-rules/pokemon')} pokemonRules rules de pokémon
   */
  constructor(repo = new PlayerRepo(), rules = pRule, gameRules = gRule, pokemonRules = pkmRule) {
    super();
    this.repo = repo;
    this.rules = rules;
    this.gameRules = gameRules;
    this.pokemonRules = pokemonRules;
  }

  async setUp(request, response, next) {
    return this.start(request, response)
      .then(({ body }) => this.gameRules.exists.byId(body))
      .then((body) => this.rules.exists.create({ user: response.locals.user._id, ...body }))
      .then((player) => this.repo.setUp(player))
      .then((output) => this.finish(output, response, next))
      .catch(next);
  }

  async capture(request, response, next) {
    return this.start(request, response)
      .then(({ body, params }) => this.rules.exists.findOne(
        { user: response.locals.user._id, ...body, ...params },
      ))
      .then((data) => this.rules.exists.pokemon(data))
      .then((data) => this.pokemonRules.related.get(data))
      .then((data) => this.pokemonRules.checkPrepare.execute(data))
      .then((data) => this.repo.capture(data))
      .then((data) => this.finish(data, response, next))
      .catch(next);
  }

  async release(request, response, next) {
    return this.start(request, response)
      .then(({ params }) => this.rules.exists.andOwnsPokemon(
        { user: response.locals.user._id, ...params },
      ))
      .then((data) => this.rules.exists.isBase(data))
      .then((data) => this.repo.release(data))
      .then((data) => this.finish(data, response, next))
      .catch(next);
  }
};
