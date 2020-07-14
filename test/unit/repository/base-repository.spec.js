const expect = require('expect');
const BaseRepo = require('../../../src/repository/base-repository');

const runTests = () => {
  describe('Base', () => {
    // TODO melhorar
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
        if (toBeReturned) {
          return {
            populate: (populateData) => {
              stash.push(populateData);
              return {
                execPopulate: () => (true),
              };
            },
            ...toBeReturned,
          };
        }
        return undefined;
      },
      findOneAndUpdate: (queryData, updateData, options) => {
        stash.push(queryData);
        stash.push(updateData);
        stash.push(options);
        return {
          exec: () => {
            if (toBeReturned) {
              return {
                toJSON: () => toBeReturned,
                populate: (populateData) => {
                  stash.push(populateData);
                  return {
                    execPopulate: () => (true),
                  };
                },
              };
            }
            return undefined;
          },
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

    describe('FindOne', () => {
      it('no populate', async () => {
        const stash = [];
        const toBeReturned = { this: 'should be reurned' };
        const modelMock = getModelMock(stash, toBeReturned);

        const baseRepo = new BaseRepo(modelMock);

        const toBeChecked = { random: 'data' };
        const toBeProjected = { random: 'projection' };

        const { populate, ...response } = await baseRepo.findOne(toBeChecked, toBeProjected);

        expect(response).toEqual(toBeReturned);
        expect(stash).toEqual([toBeChecked, toBeProjected]);
      });

      it('populate', async () => {
        const stash = [];
        const toBeReturned = { this: 'should be reurned' };
        const modelMock = getModelMock(stash, toBeReturned);

        const baseRepo = new BaseRepo(modelMock);

        const toBeChecked = { random: 'data' };
        const toBeProjected = { random: 'projection' };
        const toBePopulated = { random: 'population' };

        const { populate, ...response } = await baseRepo
          .findOne(toBeChecked, toBeProjected, toBePopulated);

        expect(response).toEqual(toBeReturned);
        expect(stash).toEqual([toBeChecked, toBeProjected, toBePopulated]);
      });

      it('not found', async () => {
        const stash = [];
        const modelMock = getModelMock(stash);

        const baseRepo = new BaseRepo(modelMock);

        const toBeChecked = { random: 'data' };
        const toBeProjected = { random: 'projection' };

        const response = await baseRepo.findOne(toBeChecked, toBeProjected);

        expect(response).toBeUndefined();
        expect(stash).toEqual([toBeChecked, toBeProjected]);
      });

      it('not found with population', async () => {
        const stash = [];
        const modelMock = getModelMock(stash);

        const baseRepo = new BaseRepo(modelMock);

        const toBeChecked = { random: 'data' };
        const toBeProjected = { random: 'projection' };
        const toBePopulated = { random: 'population' };

        const response = await baseRepo.findOne(toBeChecked, toBeProjected, toBePopulated);

        expect(response).toBeUndefined();
        expect(stash).toEqual([toBeChecked, toBeProjected]);
      });
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

      it('not found', async () => {
        const stash = [];
        const modelMock = getModelMock(stash);

        const baseRepo = new BaseRepo(modelMock);

        const toBeFound = { random: 'query' };
        const toBeUpdated = { random: 'data' };

        const response = await baseRepo.findOneAndUpdate(toBeFound, toBeUpdated);

        expect(response).toBeUndefined();
        expect(stash).toEqual(
          [toBeFound, toBeUpdated, { new: true, useFindAndModify: false }],
        );
      });

      it('not found with population', async () => {
        const stash = [];
        const modelMock = getModelMock(stash);

        const baseRepo = new BaseRepo(modelMock);

        const toBeFound = { random: 'query' };
        const toBeUpdated = { random: 'data' };
        const toBeProjected = { random: 'projection' };

        const response = await baseRepo.findOneAndUpdate(toBeFound, toBeUpdated, toBeProjected);

        expect(response).toBeUndefined();
        expect(stash).toEqual(
          [toBeFound, toBeUpdated, { new: true, useFindAndModify: false }],
        );
      });
    });
  });
};

module.exports = runTests;
