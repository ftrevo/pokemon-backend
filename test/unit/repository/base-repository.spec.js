const expect = require('expect');
const BaseRepo = require('../../../src/repository/base-repository');

const runTests = () => {
  describe('Base', () => {
    const getModelMock = (stash, toBeReturned) => ({
      exists: (existsData) => {
        stash.push(existsData);
        return toBeReturned;
      },
      create: (createData) => {
        stash.push(createData);
        return { toJSON: () => toBeReturned };
      },
      findOne: (data, projectionFields) => {
        stash.push(data);
        stash.push(projectionFields);
        return toBeReturned;
      },
      findOneAndUpdate: (queryData, updateData, options) => {
        stash.push(queryData);
        stash.push(updateData);
        stash.push(options);
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

    it('exists', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const modelMock = getModelMock(stash, toBeReturned);

      const baseRepo = new BaseRepo(modelMock);

      const toBeChecked = { random: 'data' };

      const response = await baseRepo.exists(toBeChecked);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeChecked]);
    });

    it('create', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const modelMock = getModelMock(stash, toBeReturned);

      const baseRepo = new BaseRepo(modelMock);

      const toBeChecked = { random: 'data' };

      const response = await baseRepo.create(toBeChecked);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeChecked]);
    });

    it('findOne', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };
      const modelMock = getModelMock(stash, toBeReturned);

      const baseRepo = new BaseRepo(modelMock);

      const toBeChecked = { random: 'data' };
      const toBeProjected = { random: 'projection' };

      const response = await baseRepo.findOne(toBeChecked, toBeProjected);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([toBeChecked, toBeProjected]);
    });


    describe('FindOneAndUpdate', () => {
      it('no populate', async () => {
        const stash = [];
        const toBeReturned = { this: 'should be reurned' };
        const modelMock = getModelMock(stash, toBeReturned);

        const baseRepo = new BaseRepo(modelMock);

        const toBeFound = { random: 'query' };
        const toBeUpdated = { random: 'data' };

        const response = await baseRepo.findOneAndUpdate(toBeFound, toBeUpdated);

        expect(response).toEqual(toBeReturned);
        expect(stash).toEqual(
          [toBeFound, toBeUpdated, { new: true, useFindAndModify: false }],
        );
      });

      it('populate', async () => {
        const stash = [];
        const toBeReturned = { this: 'should be reurned' };
        const modelMock = getModelMock(stash, toBeReturned);

        const baseRepo = new BaseRepo(modelMock);

        const toBeFound = { random: 'query' };
        const toBeUpdated = { random: 'data' };
        const toBeProjected = { random: 'projection' };

        const response = await baseRepo.findOneAndUpdate(toBeFound, toBeUpdated, toBeProjected);

        expect(response).toEqual(toBeReturned);
        expect(stash).toEqual(
          [toBeFound, toBeUpdated, { new: true, useFindAndModify: false }, toBeProjected],
        );
      });
    });
  });
};

module.exports = runTests;
