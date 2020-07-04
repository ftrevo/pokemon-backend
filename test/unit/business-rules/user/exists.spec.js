const expect = require('expect');
const faker = require('faker');
const Exists = require('../../../../src/business-rules/user/exists');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');

const runTests = () => {
  describe('Exists', () => {
    const getMockedRepo = (stash, existsResult) => (
      {
        exists: (data) => {
          stash.push(data);
          return existsResult;
        },
      }
    );

    describe('SignUp', () => {
      it('user already exists', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, true));

        const userData = {
          toBe: 'checked',
          email: faker.internet.email(),
        };

        try {
          await exists.signUp(userData);
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Usuário(a) já existente');
          expect(stash).toHaveProperty('0', { email: userData.email });
        }
      });

      it('unexisting user', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, false));

        const userData = {
          toBe: 'checked',
          email: faker.internet.email(),
        };

        const existsResult = await exists.signUp(userData);

        expect(stash).toHaveProperty('0', { email: userData.email });
        expect(existsResult).toEqual(userData);
      });
    });
  });
};

module.exports = runTests;
