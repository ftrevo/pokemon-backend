/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');

const app = require('../../../src/app');
const { validateIdData, validateDate, validateError } = require('../../test-util');

describe('# Sign-up - Integration', () => {
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

    validateIdData(body);

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('data.name', toBeSend.name);
    expect(body).toHaveProperty('data.email', toBeSend.email);
    expect(body).toHaveProperty('data._id');
    expect(ObjectId.isValid(body.data._id)).toBeTruthy();
    expect(body).toHaveProperty('data.createdAt');
    validateDate(body.data.createdAt);
  });

  it('error payload', async () => {
    const toBeSend = {};

    const { body } = await supertest(app)
      .post('/user/sign-up')
      .send(toBeSend)
      .expect(400);

    validateIdData(body);
    validateError(body);

    expect(body).toHaveProperty(
      'message',
      ['"nome" é obrigatório', '"senha" é obrigatório', '"e-mail" é obrigatório'],
    );
  });
});
