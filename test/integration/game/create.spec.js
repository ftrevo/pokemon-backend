/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');
const { sign } = require('jsonwebtoken');

const app = require('../../../src/app');
const { validateDefaultResponse, validateCreatedAt, validateError } = require('../../test-util');
const User = require('../../../src/models/user');
const { tokenRegex } = require('../../../src/helpers/utils');

const runTests = () => {
  describe('Create', () => {
    let authorization;

    // TODO usar Promise.all para melhorar performance
    before(async () => {
      const registeredUser = new User({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      });
      const { password, ...user } = await (await registeredUser.save()).toJSON();

      authorization = `${process.env.TOKEN_TYPE} ${await sign(user, process.env.SECRET)}`;
    });


    it('success', async () => {
      const { body } = await supertest(app)
        .post('/game')
        .set({ authorization })
        .send()
        .expect(200);

      validateDefaultResponse(body);

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.token');
      expect(body.data.token).toMatch(tokenRegex);
      expect(body).toHaveProperty('data._id');
      expect(ObjectId.isValid(body.data._id)).toBeTruthy();
      validateCreatedAt(body.data);
    });

    describe('error', () => {
      it('maker already has a game', async () => {
        const { body } = await supertest(app)
          .post('/game')
          .set({ authorization })
          .send()
          .expect(422);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['O usuário já tem um jogo não finalizado']);
      });

      it('no header', async () => {
        const { body } = await supertest(app)
          .post('/game')
          .send()
          .expect(401);

        validateDefaultResponse(body);
        validateError(body);

        expect(body).toHaveProperty('message', ['Não autorizado']);
      });
    });
  });
};

module.exports = runTests;
