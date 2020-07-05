const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const GameRepo = require('../../../src/repository/game');
const { getToken } = require('../../../src/helpers/utils');

const runTests = () => {
  describe('Game', () => {
    const getModelMock = (stash, toBeReturned) => ({
      findOneAndUpdate: (queryData, updateData) => {
        stash.push(queryData);
        stash.push(updateData);
        return {
          exec: () => ({
            toJSON: () => toBeReturned,
            populate: (populateData) => {
              stash.push(populateData);
              return {
                execPopulate: () => (true),
              };
            },
          }),
        };
      },
    });

    it('join', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };

      const gameRepo = new GameRepo(getModelMock(stash, toBeReturned));

      const token = getToken();
      const user = new ObjectId().toString();

      const response = await gameRepo.join({ token, user });

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([
        { token },
        { $addToSet: { users: [user] } },
        [{ path: 'maker', select: 'name' }, { path: 'users', select: 'name' }],
      ]);
    });
  });
};

module.exports = runTests;
