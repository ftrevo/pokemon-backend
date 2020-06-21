const supertest = require('supertest');
const expect = require('expect');
const faker = require('faker');

const app = require('../../../src/app');
const { validateDefaultResponse, validateError } = require('../../test-util');
const User = require('../../../src/models/user');

describe('# Sign-in - Integration', () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  before(async () => {
    const registeredUser = new User({ email, password, name: 'Registered User' });
    await registeredUser.save();
  });

  it('success', async () => {
    const { body } = await supertest(app)
      .post('/user/sign-in')
      .send({ email, password })
      .expect(200);

    validateDefaultResponse(body);

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('data.token');
    expect(body).toHaveProperty('data.token.value');
    expect(body).toHaveProperty('data.token.type', process.env.TOKEN_TYPE);
  });

  describe('## error', () => {
    it('payload', async () => {
      const { body } = await supertest(app)
        .post('/user/sign-in')
        .send({})
        .expect(400);

      validateDefaultResponse(body);
      validateError(body);

      expect(body).toHaveProperty(
        'message',
        ['"e-mail" é obrigatório', '"senha" é obrigatório'],
      );
    });

    it('unexisting user', async () => {
      const { body } = await supertest(app)
        .post('/user/sign-in')
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401);

      validateDefaultResponse(body);
      validateError(body);

      expect(body).toHaveProperty(
        'message',
        ['Usuário(a) e/ou senha invalido(a)'],
      );
    });

    it('wrong password', async () => {
      const { body } = await supertest(app)
        .post('/user/sign-in')
        .send({ email, password: faker.internet.password() })
        .expect(401);

      validateDefaultResponse(body);
      validateError(body);

      expect(body).toHaveProperty(
        'message',
        ['Usuário(a) e/ou senha invalido(a)'],
      );
    });
  });
});
