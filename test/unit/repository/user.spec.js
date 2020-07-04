const expect = require('expect');
const UserRepo = require('../../../src/repository/user');

const runTests = () => {
  describe('User', () => {
    const getBaseMock = (stash, toBeReturned) => ({
      create: (createData) => {
        stash.push(createData);
        return toBeReturned;
      },
      exists: (existsData) => {
        stash.push(existsData);
        return toBeReturned;
      },
      findOne: (data, projectionData) => {
        stash.push(data);
        stash.push(projectionData);
        return toBeReturned;
      },
    });

    it('create', async () => {
      const stash = [];
      const baseUser = { name: 'toBeReturned' };
      const baseMock = getBaseMock(
        stash,
        {
          ...baseUser,
          password: 'should not return',
          deviceId: 'should not return',
          updatedAt: 'should not return',
        },
      );

      const userRepo = new UserRepo(undefined, baseMock);

      const toBeCreated = { random: 'data' };

      const response = await userRepo.create(toBeCreated);

      expect(response).toEqual(baseUser);
      expect(stash).toEqual([toBeCreated]);
    });

    it('exists', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const baseMock = getBaseMock(stash, toBeReturned);

      const userRepo = new UserRepo(undefined, baseMock);

      const toBeChecked = { random: 'data' };

      const response = await userRepo.exists(toBeChecked);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeChecked]);
    });

    it('findOne', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const baseMock = getBaseMock(stash, toBeReturned);

      const userRepo = new UserRepo(undefined, baseMock);

      const toBeFound = { random: 'data' };
      const toBeProjected = { random: 'projection' };

      const response = await userRepo.findOne(toBeFound, toBeProjected);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeFound, toBeProjected]);
    });
  });
};

module.exports = runTests;
