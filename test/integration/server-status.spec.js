const supertest = require('supertest');
const expect = require('expect');

const app = require('../../src/app');
const { validateDefaultResponse } = require('../test-util');

const runTests = () => {
  describe('Server Status', () => {
    it('success', async () => {
      const { body } = await supertest(app)
        .get('/')
        .expect(200);

      validateDefaultResponse(body);

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.message', 'Server is up!');
      expect(body).toHaveProperty('data.dbState', 'connected');
      expect(body).toHaveProperty('data.upTime');
      expect(body.data.upTime).toMatch(/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9]$/);
    });
  });
};

module.exports = runTests;
