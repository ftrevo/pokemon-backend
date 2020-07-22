/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const faker = require('faker');
const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const PlayerRepo = require('../../../src/repository/player');

const runTests = () => {
  describe('Player', () => {
    const getModelMock = (stash, toBeReturned) => ({
      create: (createData) => {
        stash.push(createData);
        return {
          toJSON: () => toBeReturned,
          populate: (populateData) => {
            stash.push(populateData);
            return { execPopulate: () => (true) };
          },
        };
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
              return { execPopulate: () => (true) };
            },
          }),
        };
      },
    });

    it('setUp', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };

      const gameRepo = new PlayerRepo(getModelMock(stash, toBeReturned));

      const starterPokemon = faker.random.number({ min: 1, max: 151 });

      const player = {
        user: new ObjectId().toString(),
        game: new ObjectId().toString(),
        starterPokemon,
      };

      const response = await gameRepo.setUp(player);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([
        {
          ...player,
          pokemons: [{
            number: player.starterPokemon, hasBase: true, isActive: true, merged: [starterPokemon],
          }],
        },
        [{ path: 'game', select: 'maker', populate: { path: 'maker', select: 'name' } }],
      ]);
    });

    it('capture', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };

      const gameRepo = new PlayerRepo(getModelMock(stash, toBeReturned));

      const data = {
        _id: new ObjectId().toString(),
        changes: { random: 'stuff here' },
      };

      const response = await gameRepo.capture(data);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([
        { _id: data._id },
        data.changes,
        { new: true, useFindAndModify: false },
      ]);
    });
  });
};

module.exports = runTests;
