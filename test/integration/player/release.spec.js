/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');
const { sign } = require('jsonwebtoken');

const app = require('../../../src/app');
const { validateDefaultResponse, validateError } = require('../../test-util');
const User = require('../../../src/models/user');
const Game = require('../../../src/models/game');
const Player = require('../../../src/models/player');
const { idRegex } = require('../../../src/helpers/utils');

const runTests = () => {
  describe('Release', () => {
    let authorization;
    let playerId;
    const toBeReleased = 1;
    const starterPokemon = 4;
    const otherPokemon = 21;

    before(async () => {
      const createdUser = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      });

      const otherUserId = new User()._id;

      const createdGame = new Game({ maker: createdUser._id, players: [createdUser._id, otherUserId] });

      const createdPlayer = new Player({
        user: createdUser._id,
        game: createdGame._id,
        pokemons: [{ number: starterPokemon, merged: [starterPokemon] }, { number: toBeReleased, merged: [toBeReleased] }],
        starterPokemon,
      });

      const otherPlayer = new Player({
        user: otherUserId,
        game: createdGame._id,
        pokemons: [{ number: otherPokemon, merged: [otherPokemon] }],
        otherPokemon,
      });

      await Promise.all([
        createdUser.save(),
        createdGame.save(),
        createdPlayer.save(),
        otherPlayer.save(),
      ]);

      playerId = createdPlayer._id.toString();

      const { password, ...user } = await createdUser.toJSON();

      authorization = `${process.env.TOKEN_TYPE} ${await sign(user, process.env.SECRET)}`;
    });


    describe('success', () => {
      it('releasing existing', async () => {
        const { body } = await supertest(app)
          .delete(`/player/${playerId}/pokemon/${toBeReleased}`)
          .set({ authorization })
          .send()
          .expect(200);

        validateDefaultResponse(body);

        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('data._id');
        expect(body.data._id).toMatch(idRegex);
        expect(body).toHaveProperty('data.starterPokemon', starterPokemon);
        expect(body).toHaveProperty('data.pokemons', [{
          hasBase: true,
          isActive: true,
          fullyEvolved: false,
          number: starterPokemon,
          merged: [starterPokemon],
        }]);
      });
    });

    describe('error', () => {
      it('no header', async () => {
        const { body } = await supertest(app)
          .delete(`/player/${playerId}/pokemon/11`)
          .send({})
          .expect(401);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Não autorizado']);
      });

      it('not captured by you', async () => {
        const { body } = await supertest(app)
          .delete(`/player/${playerId}/pokemon/${otherPokemon}`)
          .set({ authorization })
          .send()
          .expect(422);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty(
          'message',
          ['O pokémon que você está tentando soltar não foi capturado por você'],
        );
      });
    });
  });
};

module.exports = runTests;
