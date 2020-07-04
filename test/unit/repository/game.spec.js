const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const GameRepo = require('../../../src/repository/game');
const { getToken } = require('../../test-util');

const runTests = () => {
  describe('Game', () => {
    const getBaseMock = (stash, toBeReturned) => ({
      create: (createData) => {
        stash.push(createData);
        return toBeReturned;
      },
      exists: (existsData) => {
        stash.push(existsData);
        return toBeReturned;
      },
      findOneAndUpdate: (data, updateData, model, populateData) => {
        stash.push(data);
        stash.push(updateData);
        stash.push(populateData);
        return toBeReturned;
      },
    });

    it('join', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const baseMock = getBaseMock(stash, toBeReturned);

      const token = getToken();
      const player = new ObjectId().toString();

      const gameRepo = new GameRepo(undefined, baseMock);

      const response = await gameRepo.join({ token, player });

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([{ token }, { $addToSet: { players: [player] } }, [{ path: 'maker', select: 'name' }, { path: 'players', select: 'name' }]]);
    });

    it('create', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const baseMock = getBaseMock(stash, toBeReturned);

      const gameRepo = new GameRepo(undefined, baseMock);

      const toBeChecked = { random: 'data' };

      const response = await gameRepo.create(toBeChecked);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeChecked]);
    });

    it('exists', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const baseMock = getBaseMock(stash, toBeReturned);

      const gameRepo = new GameRepo(undefined, baseMock);

      const toBeChecked = { random: 'data' };

      const response = await gameRepo.exists(toBeChecked);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeChecked]);
    });
  });
};

module.exports = runTests;
