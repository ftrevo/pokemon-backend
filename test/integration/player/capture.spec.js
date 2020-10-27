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
  describe('Capture', () => {
    let authorization;
    let playerId;
    const starterPokemon = 4;

    before(async () => {
      const createdUser = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      });

      const createdGame = new Game({ maker: createdUser._id, players: [createdUser._id] });

      const playerCreated = new Player({
        user: createdUser._id,
        game: createdGame._id,
        pokemons: [{ number: 4, merged: [4] }],
        starterPokemon,
      });

      await Promise.all([
        createdUser.save(),
        createdGame.save(),
        playerCreated.save(),
      ]);

      playerId = playerCreated._id.toString();

      const { password, ...user } = await createdUser.toJSON();

      authorization = `${process.env.TOKEN_TYPE} ${await sign(user, process.env.SECRET)}`;
    });


    it('success', async () => {
      const captured = 1;

      const { body } = await supertest(app)
        .patch(`/player/${playerId}/pokemon`)
        .set({ authorization })
        .send({ pokemon: captured })
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
      },
      {
        hasBase: true, isActive: true, fullyEvolved: false, number: captured, merged: [captured],
      }]);
    });

    describe('error', () => {
      it('no header', async () => {
        const { body } = await supertest(app)
          .patch(`/player/${playerId}/pokemon`)
          .send({})
          .expect(401);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Não autorizado']);
      });

      it('empty body', async () => {
        const { body } = await supertest(app)
          .patch(`/player/${playerId}/pokemon`)
          .set({ authorization })
          .send({})
          .expect(400);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty(
          'message',
          ['"pokémon" é obrigatório'],
        );
      });

      it('invalid type', async () => {
        const { body } = await supertest(app)
          .patch(`/player/${playerId}/pokemon`)
          .set({ authorization })
          .send({ pokemon: false })
          .expect(400);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty(
          'message',
          ['"pokémon" deve ser um número'],
        );
      });

      it('already captured', async () => {
        const { body } = await supertest(app)
          .patch(`/player/${playerId}/pokemon`)
          .set({ authorization })
          .send({ pokemon: 4 })
          .expect(422);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty(
          'message',
          ['O pokémon já foi capturado neste jogo'],
        );
      });
    });
  });
};

module.exports = runTests;
