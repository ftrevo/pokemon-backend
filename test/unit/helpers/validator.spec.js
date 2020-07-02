const expect = require('expect');
const { execute } = require('../../../src/helpers/validator');

const getSchema = (stash, toBeReturned) => ({
  validate: (data) => {
    stash.push(data);
    return toBeReturned;
  },
});

const runTests = () => {
  describe('Validator', () => {
    it('success', async () => {
      const stash = [];

      const value = { random: 'data' };

      const returned = execute(getSchema(stash, { value }), value, 400);

      expect(returned).toEqual(value);
      expect(stash).toHaveProperty('0', value);
    });

    describe('Validator', () => {
      it('business error', () => {
        const stash = [];

        const value = { random: 'data' };
        const error = { something: 'business random data' };

        const statusCode = 422;
        try {
          execute(getSchema(stash, { value, error }), value, statusCode);
        } catch (thrownError) {
          expect(thrownError).toHaveProperty('statusCode', statusCode);
          expect(thrownError).toHaveProperty('isBusiness', true);
          expect(thrownError).toHaveProperty('something', error.something);
        }
      });

      it('server error', async () => {
        const stash = [];

        const value = { random: 'data' };
        const error = { another: 'internal random data' };

        const statusCode = 500;
        try {
          execute(getSchema(stash, { value, error }), value, statusCode);
        } catch (thrownError) {
          expect(thrownError).toHaveProperty('statusCode', statusCode);
          expect(thrownError).toHaveProperty('isBusiness', false);
          expect(thrownError).toHaveProperty('another', error.another);
        }
      });
    });
  });
};

module.exports = runTests;
