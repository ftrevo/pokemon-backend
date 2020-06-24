const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const Exists = require('../../../../src/business-rules/game/exists');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');

const getMockedRepo = (stash, expectedResult) => ({
  exists: (query) => {
    stash.push(query);
    return expectedResult;
  },
});

const runTests = () => {
  describe('Exists', () => {
    describe('create', () => {
      it('game creator does not have previous unfinished game', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, false));

        const id = ObjectId().toHexString();

        const existsResult = await exists.create({ _id: id });

        expect(existsResult).toBeFalsy();
        expect(stash).toHaveProperty('0', { _id: id, winner: { $exists: false } });
      });

      it('game creator have previous unfinished game', async () => {
        const stash = [];

        const exists = new Exists(getMockedRepo(stash, true));

        try {
          await exists.create({ _id: '54321' });
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'O usuário já tem um jogo não finalizado');
          expect(stash).toHaveProperty('0', { _id: '54321', winner: { $exists: false } });
        }
      });
    });
  });
};

module.exports = runTests;
