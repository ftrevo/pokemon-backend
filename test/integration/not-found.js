const supertest = require('supertest');
const expect = require('expect');

const app = require('../../src/app');
const { validateDefaultResponse } = require('../test-util');

describe('# Not Found - Integration', () => {
  it('success', async () => {
    const { body } = await supertest(app)
      .get('/not-found')
      .expect(404);

    validateDefaultResponse(body);

    expect(body).toHaveProperty('message', ['Rota não encontrada']);
  });
});
