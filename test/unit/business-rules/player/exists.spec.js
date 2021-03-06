/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const Exists = require('../../../../src/business-rules/player/exists');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');

const runTests = () => {
  describe('Exists', () => {
    const getMockedRepo = (stash, expectedResult) => ({
      exists: (query) => {
        stash.push(query);
        return expectedResult;
      },
      findOne: (query, projection, populateData) => {
        stash.push(query);
        stash.push(projection);
        stash.push(populateData);
        if (expectedResult) {
          return { toJSON: () => expectedResult };
        }
        return false;
      },
    });

    describe('Create', () => {
      it('player does not exist', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, false));

        const inputData = {
          game: new ObjectId().toString(),
          user: new ObjectId().toString(),
          other: 'random data',
        };

        const existsResult = await exists.create(inputData);

        expect(existsResult).toEqual(inputData);
        expect(stash).toHaveProperty('0', { game: inputData.game, user: inputData.user });
      });

      it('player already exists', async () => {
        const stash = [];

        const exists = new Exists(getMockedRepo(stash, true));

        const inputData = {
          game: new ObjectId().toString(),
          user: new ObjectId().toString(),
          other: 'random data',
        };

        try {
          await exists.create(inputData);
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'O jogador já iniciou este jogo');
          expect(stash).toHaveProperty('0', { game: inputData.game, user: inputData.user });
        }
      });
    });

    describe('FindOne', () => {
      it('player found', async () => {
        const data = { random: 'stuff' };
        const stash = [];

        const exists = new Exists(getMockedRepo(stash, data));

        const inputData = { _id: new ObjectId().toString(), other: 'random' };

        const existsResult = await exists.findOne(inputData);

        expect(existsResult).toEqual({ ...inputData, ...data });
        expect(stash).toHaveProperty('0', { _id: inputData._id });
      });

      it('player not found', async () => {
        const stash = [];

        const exists = new Exists(getMockedRepo(stash, false));

        const inputData = { _id: new ObjectId().toString(), other: 'random' };

        try {
          await exists.findOne(inputData);
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Jogador não encontrado');
          expect(stash).toHaveProperty('0', { _id: inputData._id });
        }
      });
    });

    describe('Pokemon', () => {
      it('not found', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, false));

        const inputData = { game: new ObjectId().toString(), pokemon: 'random', additional: 'data' };

        const existsResult = await exists.pokemon(inputData);

        expect(existsResult).toEqual(inputData);
        expect(stash).toHaveProperty('0', { game: inputData.game, 'pokemons.merged': inputData.pokemon });
      });

      it('found', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, true));

        const inputData = { game: new ObjectId().toString(), pokemon: 'random', additional: 'data' };

        try {
          await exists.pokemon(inputData);
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'O pokémon já foi capturado neste jogo');
          expect(stash).toHaveProperty('0', { game: inputData.game, 'pokemons.merged': inputData.pokemon });
        }
      });
    });

    describe('AndOwnsPokemon', () => {
      const inputData = {
        _id: new ObjectId().toString(),
        user: new ObjectId().toString(),
        number: 4,
      };

      it('player exists and owns', async () => {
        const databaseUser = { starterPokemon: 4, pokemons: [{ number: 4 }] };
        const stash = [];
        const exists = new Exists(getMockedRepo(stash, databaseUser));

        const existsAndOwnsResult = await exists.andOwnsPokemon(inputData);

        expect(existsAndOwnsResult).toEqual({ ...inputData, ...databaseUser });
        expect(stash).toHaveProperty('0', { _id: inputData._id, user: inputData.user, 'pokemons.number': inputData.number });
      });

      it('player does not exists or do not own', async () => {
        const stash = [];
        const exists = new Exists(getMockedRepo(stash));

        try {
          await exists.andOwnsPokemon(inputData);
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'O pokémon que você está tentando soltar não foi capturado por você');
          expect(stash).toHaveProperty('0', { _id: inputData._id, user: inputData.user, 'pokemons.number': inputData.number });
        }
      });
    });

    describe('IsBase', () => {
      it('false', async () => {
        const inputData = {
          starterPokemon: 4,
          number: 1,
        };
        const exists = new Exists();

        const existsAndOwnsResult = await exists.isBase(inputData);

        expect(existsAndOwnsResult).toEqual(inputData);
      });

      it('true', async () => {
        const exists = new Exists();

        try {
          await exists.isBase({ starterPokemon: 4, number: 4 });
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Você não pode liberar seu pokémon inicial');
        }
      });
    });
  });
};

module.exports = runTests;
