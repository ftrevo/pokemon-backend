/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');
const { sign } = require('jsonwebtoken');

const app = require('../../../src/app');
const { validateDefaultResponse, validateCreatedAt, validateError } = require('../../test-util');
const User = require('../../../src/models/user');
const Game = require('../../../src/models/game');

const runTests = () => {
  describe('Join', () => {
    const joiner = {};
    const game = {};
    let finishedGameToken;
    let maxPlayersGameToken;

    // TODO usar Promise.all para melhorar performance
    before(async () => {
      const { _id: makerId, name: makerName } = await (await new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      }).save()).toJSON();

      game.maker = { data: { _id: makerId, name: makerName } };
      game.data = (
        await new Game({ maker: makerId, players: [makerId] }).save()
      ).toJSON();
      game.maker.auth = `${process.env.TOKEN_TYPE} ${await sign(game.maker.data, process.env.SECRET)}`;

      const { _id: joinerId, name: joinerName } = await (await new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      }).save()).toJSON();

      joiner.data = { _id: joinerId, name: joinerName };
      joiner.auth = `${process.env.TOKEN_TYPE} ${await sign(joiner.data, process.env.SECRET)}`;

      const finishedGame = (
        await new Game({ maker: makerId, players: [makerId], winner: makerId }).save()
      ).toJSON();
      finishedGameToken = finishedGame.token;

      const maxPlayersGame = (
        await new Game({
          maker: makerId,
          players: [
            makerId,
            new ObjectId().toString(),
            new ObjectId().toString(),
            new ObjectId().toString(),
            new ObjectId().toString(),
            new ObjectId().toString(),
          ],
          winner: makerId,
        }).save()
      ).toJSON();
      maxPlayersGameToken = maxPlayersGame.token;
    });

    describe('Success', () => {
      it('joining game', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({ token: game.data.token })
          .expect(200);

        validateDefaultResponse(body);

        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('data.players.length', 2);
        expect(body).toHaveProperty('data.players', [game.maker.data, joiner.data]);
        expect(body).toHaveProperty('data.maker', game.maker.data);
        expect(body).toHaveProperty('data.token', game.data.token);
        expect(body).toHaveProperty('data._id');
        expect(ObjectId.isValid(body.data._id)).toBeTruthy();
        validateCreatedAt(body.data);
      });

      it('rejoining game', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({ token: game.data.token })
          .expect(200);

        validateDefaultResponse(body);

        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('data.players.length', 2);
        expect(body).toHaveProperty('data.players', [game.maker.data, joiner.data]);
        expect(body).toHaveProperty('data.maker', game.maker.data);
        expect(body).toHaveProperty('data.token', game.data.token);
        expect(body).toHaveProperty('data._id');
        expect(ObjectId.isValid(body.data._id)).toBeTruthy();
        validateCreatedAt(body.data);
      });

      it('owner joining game', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: game.maker.auth })
          .send({ token: game.data.token })
          .expect(200);

        validateDefaultResponse(body);

        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('data.players.length', 2);
        expect(body).toHaveProperty('data.players', [game.maker.data, joiner.data]);
        expect(body).toHaveProperty('data.maker', game.maker.data);
        expect(body).toHaveProperty('data.token', game.data.token);
        expect(body).toHaveProperty('data._id');
        expect(ObjectId.isValid(body.data._id)).toBeTruthy();
        validateCreatedAt(body.data);
      });
    });

    describe('error', () => {
      it('no body', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({})
          .expect(400);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['"token" é obrigatório']);
      });

      it('invalid type', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({ token: {} })
          .expect(400);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['"token" deve ser uma string']);
      });

      it('no header', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .send({ token: game.data.token })
          .expect(401);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Não autorizado']);
      });

      it('non existing game', async () => {
        const nonExistingGameToken = new Game().token;

        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({ token: nonExistingGameToken })
          .expect(422);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Jogo não encontrado, já finalizado ou com o máximo de jogadores permitido']);
      });

      it('already finished game', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({ token: finishedGameToken })
          .expect(422);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Jogo não encontrado, já finalizado ou com o máximo de jogadores permitido']);
      });

      it('max players', async () => {
        const { body } = await supertest(app)
          .patch('/game')
          .set({ authorization: joiner.auth })
          .send({ token: maxPlayersGameToken })
          .expect(422);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Jogo não encontrado, já finalizado ou com o máximo de jogadores permitido']);
      });
    });
  });
};

module.exports = runTests;
