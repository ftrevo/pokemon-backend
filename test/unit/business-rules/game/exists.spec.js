const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const Exists = require('../../../../src/business-rules/game/exists');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');
const { getToken } = require('../../../test-util');

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

        const existsResult = await exists.create(id);

        expect(existsResult).toEqual(id);
        expect(stash).toHaveProperty('0', { maker: id, winner: { $exists: false } });
      });

      it('game creator have previous unfinished game', async () => {
        const stash = [];

        const exists = new Exists(getMockedRepo(stash, true));

        const id = ObjectId().toHexString();

        try {
          await exists.create(id);
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'O usuário já tem um jogo não finalizado');
          expect(stash).toHaveProperty('0', { maker: id, winner: { $exists: false } });
        }
      });
    });

    describe('join', () => {
      it('game found and available to join', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, true));

        const inputData = { token: getToken() };

        const existsResult = await exists.join(inputData);

        expect(existsResult).toEqual(inputData);
        expect(stash).toHaveProperty('0', { token: inputData.token, winner: { $exists: false }, 'players.5': { $exists: false } });
      });

      it('game not found, already finished or with max capacity', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, false));

        const inputData = { token: getToken() };
        try {
          await exists.join(inputData);
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Jogo não encontrado, já finalizado ou com o máximo de jogadores permitido');
          expect(stash).toHaveProperty('0', { token: inputData.token, winner: { $exists: false }, 'players.5': { $exists: false } });
        }
      });
    });
  });
};

module.exports = runTests;