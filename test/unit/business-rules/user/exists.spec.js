const expect = require('expect');
const Exists = require('../../../../src/business-rules/user/exists');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');

const getMockedRepo = (existsResult) => ({ exists: () => existsResult });

const runTests = () => {
  describe('Exists', () => {
    describe('signUp', () => {
      it('user already exists', async () => {
        const exists = new Exists(getMockedRepo(true));

        try {
          await exists.signUp({ toBe: 'checked' });
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Usuário(a) já existente');
        }
      });

      it('unexisting user', async () => {
        const exists = new Exists(getMockedRepo(false));

        const existsResult = await exists.signUp({ toBe: 'checked' });

        expect(existsResult).toBeFalsy();
      });
    });
  });
};

module.exports = runTests;
