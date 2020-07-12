/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');
const { sign } = require('jsonwebtoken');

const app = require('../../../src/app');
const { validateDefaultResponse, validateError } = require('../../test-util');
const User = require('../../../src/models/user');
const Game = require('../../../src/models/game');
const { idRegex } = require('../../../src/helpers/utils');

const runTests = () => {
  describe('Create', () => {
    let authorization;
    let gameId;
    let userId;
    const makerData = {};

    before(async () => {
      const createdUser = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      });

      const maker = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      });

      const createdGame = new Game({ maker: maker._id, players: [maker._id, createdUser._id] });

      await Promise.all([
        createdUser.save(),
        createdGame.save(),
        maker.save(),
      ]);

      const { password, ...user } = await createdUser.toJSON();

      userId = user._id;
      gameId = createdGame._id.toString();
      makerData._id = maker._id.toString();
      makerData.name = maker.name;

      authorization = `${process.env.TOKEN_TYPE} ${await sign(user, process.env.SECRET)}`;
    });


    it('success', async () => {
      const starterPokemon = faker.random.number({ min: 1, max: 151 });

      const { body } = await supertest(app)
        .post('/player')
        .set({ authorization })
        .send({ starterPokemon, game: gameId })
        .expect(200);

      validateDefaultResponse(body);

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data._id');
      expect(body.data._id).toMatch(idRegex);
      expect(body).toHaveProperty('data.starterPokemon', starterPokemon);
      expect(body).toHaveProperty('data.pokemons', { active: [starterPokemon], bag: [] });
      expect(body).toHaveProperty('data.user', userId);
      expect(body).toHaveProperty('data.game', { _id: gameId, maker: makerData });
    });

    describe('error', () => {
      it('no header', async () => {
        const { body } = await supertest(app)
          .post('/player')
          .send({})
          .expect(401);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Não autorizado']);
      });

      it('empty body', async () => {
        const { body } = await supertest(app)
          .post('/player')
          .set({ authorization })
          .send({})
          .expect(400);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty(
          'message',
          ['"pokémon inicial" é obrigatório', '"id do jogo" é obrigatório'],
        );
      });

      it('invalid type', async () => {
        const { body } = await supertest(app)
          .post('/player')
          .set({ authorization })
          .send({ starterPokemon: [], game: false })
          .expect(400);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty(
          'message',
          ['"pokémon inicial" deve ser um número', '"id do jogo" deve ser uma string'],
        );
      });
    });
  });
};

module.exports = runTests;
