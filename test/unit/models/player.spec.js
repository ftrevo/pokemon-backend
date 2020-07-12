/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const faker = require('faker');

const Player = require('../../../src/models/player');
const Game = require('../../../src/models/game');
const User = require('../../../src/models/user');
const { idRegex } = require('../../../src/helpers/utils');

const runTests = () => {
  describe('Player', () => {
    describe('To JSON transformation', () => {
      let baseUser;
      let baseMaker;
      let baseGame;

      before(async () => {
        baseUser = new User({
          name: faker.name.findName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        });

        baseMaker = new User({
          name: faker.name.findName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        });

        baseGame = new Game({ maker: baseMaker._id });

        await Promise.all([
          baseUser.save(),
          baseMaker.save(),
          baseGame.save(),
        ]);
      });

      it('not populated', async () => {
        const player = new Player({ user: baseUser._id, game: baseGame._id });
        await player.save();

        const playerJson = player.toJSON();

        expect(playerJson).toHaveProperty('_id');
        expect(playerJson._id).toMatch(idRegex);
        expect(playerJson).toHaveProperty('user');
        expect(playerJson.user).toMatch(idRegex);
        expect(playerJson).toHaveProperty('game');
        expect(playerJson.game).toMatch(idRegex);
      });

      it('populated', async () => {
        const player = new Player({ user: baseUser._id, game: baseGame._id });
        await player.save();
        await player.populate([{ path: 'user' }, { path: 'game', populate: { path: 'maker' } }]).execPopulate();

        const playerJson = player.toJSON();

        expect(playerJson).toHaveProperty('_id');
        expect(playerJson._id).toMatch(idRegex);

        expect(playerJson).toHaveProperty('user._id');
        expect(playerJson.user._id).toMatch(idRegex);
        expect(playerJson).toHaveProperty('user.name', baseUser.name);
        expect(playerJson).not.toHaveProperty('user.password');

        expect(playerJson).toHaveProperty('game.maker._id');
        expect(playerJson.game.maker._id).toMatch(idRegex);
        expect(playerJson).toHaveProperty('game.maker.name', baseMaker.name);
        expect(playerJson).not.toHaveProperty('game.maker.password');
      });
    });
  });
};

module.exports = runTests;
