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
    });

    it('setUp', async () => {
      const stash = [];
      const toBeReturned = { this: 'should be reurned' };

      const gameRepo = new PlayerRepo(getModelMock(stash, toBeReturned));

      const player = {
        user: new ObjectId().toString(),
        game: new ObjectId().toString(),
        starterPokemon: faker.random.number({ min: 1, max: 151 }),
      };

      const response = await gameRepo.setUp(player);

      expect(response).toEqual(toBeReturned);
      expect(stash).toEqual([
        { ...player, pokemons: [{ number: player.starterPokemon }] },
        [{ path: 'game', select: 'maker', populate: { path: 'maker', select: 'name' } }],
      ]);
    });
  });
};

module.exports = runTests;
