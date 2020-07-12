const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const Exists = require('../../../../src/business-rules/player/exists');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');

const runTests = () => {
  describe('Exists', () => {
    const getMockedRepo = (stash, expectedResult) => ({
      exists: (query) => {
        stash.push(query);
        return expectedResult;
      },
    });

    describe('Create', () => {
      it('player does not exist', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, false));

        const inputData = {
          game: new ObjectId().toString(),
          user: new ObjectId().toString(),
          other: 'random data',
        };

        const existsResult = await exists.create(inputData);

        expect(existsResult).toEqual(inputData);
        expect(stash).toHaveProperty('0', { game: inputData.game, user: inputData.user });
      });

      it('player already exists', async () => {
        const stash = [];

        const exists = new Exists(getMockedRepo(stash, true));

        const inputData = {
          game: new ObjectId().toString(),
          user: new ObjectId().toString(),
          other: 'random data',
        };

        try {
          await exists.create(inputData);
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'O jogador já iniciou este jogo');
          expect(stash).toHaveProperty('0', { game: inputData.game, user: inputData.user });
        }
      });
    });
  });
};

module.exports = runTests;
