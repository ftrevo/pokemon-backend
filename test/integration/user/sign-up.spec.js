/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');

const app = require('../../../src/app');
const { validateDefaultResponse, validateDate, validateError } = require('../../test-util');

const runTests = () => {
  describe('Sign-up', () => {
    it('success', async () => {
      const toBeSend = {
        name: faker.name.findName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      const { body } = await supertest(app)
        .post('/user/sign-up')
        .send(toBeSend)
        .expect(200);

      validateDefaultResponse(body);

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.name', toBeSend.name);
      expect(body).toHaveProperty('data.email', toBeSend.email);
      expect(body).toHaveProperty('data._id');
      expect(ObjectId.isValid(body.data._id)).toBeTruthy();
      expect(body).toHaveProperty('data.createdAt');
      validateDate(body.data.createdAt);
    });

    it('empty body', async () => {
      const { body } = await supertest(app)
        .post('/user/sign-up')
        .send({})
        .expect(400);

      validateDefaultResponse(body);
      validateError(body);

      expect(body).toHaveProperty(
        'message',
        ['"nome" é obrigatório', '"senha" é obrigatório', '"e-mail" é obrigatório'],
      );
    });

    it('invalid type', async () => {
      const { body } = await supertest(app)
        .post('/user/sign-up')
        .send({ name: 1, password: false, email: [] })
        .expect(400);

      validateDefaultResponse(body);
      validateError(body);

      expect(body).toHaveProperty(
        'message',
        ['"nome" deve ser uma string', '"senha" deve ser uma string', '"e-mail" deve ser uma string'],
      );
    });
  });
};

module.exports = runTests;
