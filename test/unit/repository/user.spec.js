const expect = require('expect');
const UserRepo = require('../../../src/repository/user');

const runTests = () => {
  describe('User', () => {
    const getModelMock = (stash, toBeReturned) => ({
      create: (createData) => {
        stash.push(createData);
        return { toJSON: () => toBeReturned };
      },
    });

    it('create', async () => {
      const stash = [];
      const baseUser = { name: 'toBeReturned' };
      const modelMock = getModelMock(
        stash,
        {
          ...baseUser,
          password: 'should not return',
          deviceId: 'should not return',
          updatedAt: 'should not return',
        },
      );

      const userRepo = new UserRepo(modelMock);

      const toBeCreated = { random: 'data' };

      const response = await userRepo.create(toBeCreated);

      expect(response).toEqual(baseUser);
      expect(stash).toEqual([toBeCreated]);
    });
  });
};

module.exports = runTests;
