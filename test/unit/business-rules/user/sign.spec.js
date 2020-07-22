const expect = require('expect');
const sign = require('../../../../src/business-rules/user/sign');

const runTests = () => {
  describe('Sign', () => {
    it('success', async () => {
      const toBeSigned = { a: 'a', b: 'b' };

      const signed = await sign(toBeSigned);

      expect(signed).toHaveProperty('token');
      expect(signed).toHaveProperty('token.type', process.env.TOKEN_TYPE);
      expect(signed).toHaveProperty('token.value');
      expect(signed.token.value).not.toBeUndefined();
    });

    it('error', async () => {
      try {
        await sign();
        throw new Error('Fail');
      } catch (err) {
        expect(err).toHaveProperty('message', 'payload is required');
      }
    });
  });
};

module.exports = runTests;
