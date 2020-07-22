const faker = require('faker');
const expect = require('expect');
const Related = require('../../../../src/business-rules/pokemon/get-related');

const runTests = () => {
  describe('GetRelated', () => {
    const getMock = (stash, pokemon, previous, evolution) => ({
      pokedex: { [pokemon]: { number: pokemon } },
      playerHasPrevious: (captured, pokemons) => {
        stash.push(captured);
        stash.push(pokemons);
        return previous;
      },
      playerHasEvolution: (captured, pokemons) => {
        stash.push(captured);
        stash.push(pokemons);
        return evolution;
      },
    });

    it('player does not have related', async () => {
      const stash = [];
      const pokemon = faker.random.number({ min: 1, max: 151 });
      const utilMock = getMock(stash, pokemon);

      const getRelated = new Related(utilMock);

      const pokemons = [];
      const inputData = { pokemon, pokemons };

      const output = await getRelated.get(inputData);
      expect(output).toHaveProperty('pokemons', pokemons);
      expect(output).toHaveProperty('pokemon', pokemon);
      expect(output).toHaveProperty('captured', { number: pokemon });
      expect(output).toHaveProperty('previous', undefined);
      expect(output).toHaveProperty('evolution', undefined);
      expect(stash).toEqual([
        { number: pokemon },
        pokemons,
        { number: pokemon },
        pokemons,
      ]);
    });

    it('only previous', async () => {
      const stash = [];
      const pokemon = faker.random.number({ min: 1, max: 151 });
      const previousPkmn = { number: pokemon - 1 };
      const utilMock = getMock(stash, pokemon, previousPkmn);

      const getRelated = new Related(utilMock);

      const pokemons = [previousPkmn];
      const inputData = { pokemon, pokemons };

      const output = await getRelated.get(inputData);
      expect(output).toHaveProperty('pokemons', pokemons);
      expect(output).toHaveProperty('pokemon', pokemon);
      expect(output).toHaveProperty('captured', { number: pokemon });
      expect(output).toHaveProperty('previous', previousPkmn);
      expect(output).toHaveProperty('evolution', undefined);
      expect(stash).toEqual([
        { number: pokemon },
        pokemons,
        { number: pokemon },
        pokemons,
      ]);
    });

    it('only evolution', async () => {
      const stash = [];
      const pokemon = faker.random.number({ min: 1, max: 151 });
      const evolutionPkmn = { number: pokemon + 1 };
      const utilMock = getMock(stash, pokemon, undefined, evolutionPkmn);

      const getRelated = new Related(utilMock);

      const pokemons = [evolutionPkmn];
      const inputData = { pokemon, pokemons };

      const output = await getRelated.get(inputData);
      expect(output).toHaveProperty('pokemons', pokemons);
      expect(output).toHaveProperty('pokemon', pokemon);
      expect(output).toHaveProperty('captured', { number: pokemon });
      expect(output).toHaveProperty('previous', undefined);
      expect(output).toHaveProperty('evolution', evolutionPkmn);
      expect(stash).toEqual([
        { number: pokemon },
        pokemons,
        { number: pokemon },
        pokemons,
      ]);
    });

    it('both', async () => {
      const stash = [];
      const pokemon = faker.random.number({ min: 1, max: 151 });
      const previousPkmn = { number: pokemon - 1 };
      const evolutionPkmn = { number: pokemon + 1 };
      const utilMock = getMock(stash, pokemon, previousPkmn, evolutionPkmn);

      const getRelated = new Related(utilMock);

      const pokemons = [previousPkmn, evolutionPkmn];
      const inputData = { pokemon, pokemons };

      const output = await getRelated.get(inputData);
      expect(output).toHaveProperty('pokemons', pokemons);
      expect(output).toHaveProperty('pokemon', pokemon);
      expect(output).toHaveProperty('captured', { number: pokemon });
      expect(output).toHaveProperty('previous', previousPkmn);
      expect(output).toHaveProperty('evolution', evolutionPkmn);
      expect(stash).toEqual([
        { number: pokemon },
        pokemons,
        { number: pokemon },
        pokemons,
      ]);
    });
  });
};

module.exports = runTests;
