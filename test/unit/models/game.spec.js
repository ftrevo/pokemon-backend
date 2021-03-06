/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const faker = require('faker');

const Game = require('../../../src/models/game');
const User = require('../../../src/models/user');
const { tokenRegex, idRegex } = require('../../../src/helpers/utils');

const runTests = () => {
  describe('Game', () => {
    describe('Default values', () => {
      it('token', async () => {
        const game = new Game();

        expect(game).toHaveProperty('token');
        expect(game.token).toMatch(tokenRegex);
      });
    });

    describe('To JSON transformation', () => {
      describe('Maker', () => {
        let baseUser;

        before(async () => {
          baseUser = new User({
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
          });
          await baseUser.save();
        });

        it('not populated', async () => {
          const game = new Game({ maker: baseUser._id });
          await game.save();

          const gameJson = game.toJSON();

          expect(gameJson).toHaveProperty('maker');
          expect(gameJson.maker).toMatch(idRegex);
        });

        it('populated', async () => {
          const game = new Game({ maker: baseUser._id });
          await game.save();
          await game.populate('maker').execPopulate();

          const gameJson = game.toJSON();

          expect(gameJson).toHaveProperty('maker._id');
          expect(gameJson.maker._id).toMatch(idRegex);
          expect(gameJson).toHaveProperty('maker.name', baseUser.name);
          expect(gameJson).not.toHaveProperty('maker.password');
        });
      });

      describe('Winner', () => {
        let baseUser;

        before(async () => {
          baseUser = new User({
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
          });
          await baseUser.save();
        });

        it('not populated', async () => {
          const game = new Game({ winner: baseUser._id });
          await game.save();

          const gameJson = game.toJSON();

          expect(gameJson).toHaveProperty('winner');
          expect(gameJson.winner).toMatch(idRegex);
        });

        it('populated', async () => {
          const game = new Game({ winner: baseUser._id });
          await game.save();
          await game.populate('winner').execPopulate();

          const gameJson = game.toJSON();

          expect(gameJson).toHaveProperty('winner._id', baseUser._id.toString());
          expect(gameJson.winner._id).toMatch(idRegex);
          expect(gameJson).toHaveProperty('winner.name', baseUser.name);
          expect(gameJson).not.toHaveProperty('winner.password');
        });
      });

      describe('Users', () => {
        const baseUsers = [];
        const baseUserIds = [];

        before(async () => {
          const userOne = new User({
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
          });
          await userOne.save();
          baseUsers.push(userOne);
          baseUserIds.push(userOne._id);

          const userTwo = new User({
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
          });
          await userTwo.save();
          baseUsers.push(userTwo);
          baseUserIds.push(userTwo._id);
        });

        it('not populated', async () => {
          const game = new Game({ users: baseUserIds });
          await game.save();
          const gameJson = game.toJSON();

          expect(gameJson).toHaveProperty('users');
          expect(gameJson.users).toBeInstanceOf(Array);
          gameJson.users.forEach((singleUser, index) => {
            expect(singleUser).toMatch(baseUserIds[index]._id.toString());
          });
        });

        it('populated', async () => {
          const game = new Game({ users: baseUserIds });
          await game.save();
          await game.populate('users').execPopulate();

          const gameJson = game.toJSON();

          expect(gameJson).toHaveProperty('users');
          expect(gameJson.users).toBeInstanceOf(Array);

          gameJson.users.forEach((singleUser, index) => {
            expect(singleUser).toHaveProperty('_id', baseUsers[index]._id.toString());
            expect(singleUser).toHaveProperty('name', baseUsers[index].name);
            expect(singleUser).not.toHaveProperty('password');
          });
        });
      });
    });
  });
};

module.exports = runTests;
