/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');

const { options } = require('../../../../src/helpers/validator');
const { validations: { '/player/{id}/pokemon/{number}': release } } = require('../../../../src/validations');

const runTests = () => {
  describe('Release', () => {
    it('method type, input and output', async () => {
      expect(release).toHaveProperty('delete');
      expect(release).toHaveProperty('delete.params');
      expect(release).toHaveProperty('delete.out');
    });

    describe('input', () => {
      describe('params', () => {
        it('success', async () => {
          const baseInput = {
            _id: new ObjectId().toString(),
            number: faker.random.number({ min: 1, max: 151 }),
            additional: 'field',
          };
          const { value, error } = await release.delete.params.validate(baseInput, options);

          expect(value).toHaveProperty('_id', baseInput._id);
          expect(value).toHaveProperty('number', baseInput.number);

          expect(value).not.toHaveProperty('additional');

          expect(error).toBeUndefined();
        });

        describe('error', () => {
          it('required fields', async () => {
            const { error } = await release.delete.params.validate({}, options);

            expect(error).toHaveProperty('message', '"id" é obrigatório. "pokémon" é obrigatório');
            expect(error).toHaveProperty('details', [{
              message: '"id" é obrigatório',
              path: ['_id'],
              type: 'any.required',
              context: { label: 'id', key: '_id' },
            },
            {
              message: '"pokémon" é obrigatório',
              path: ['number'],
              type: 'any.required',
              context: { label: 'pokémon', key: 'number' },
            }]);
          });

          it('empty fields', async () => {
            const { error } = await release.delete.params.validate({ _id: '', number: 1 }, options);

            expect(error).toHaveProperty('message', '"id" não pode estar vazio');
            expect(error).toHaveProperty('details', [{
              message: '"id" não pode estar vazio',
              path: ['_id'],
              type: 'string.empty',
              context: { label: 'id', value: '', key: '_id' },
            }]);
          });

          it('invalid type', async () => {
            const { error } = await release.delete.params.validate({ _id: {}, number: [] }, options);

            expect(error).toHaveProperty('message', '"id" deve ser uma string. "pokémon" deve ser um número');
            expect(error).toHaveProperty('details', [{
              message: '"id" deve ser uma string',
              path: ['_id'],
              type: 'string.base',
              context: { label: 'id', value: {}, key: '_id' },
            },
            {
              message: '"pokémon" deve ser um número',
              path: ['number'],
              type: 'number.base',
              context: { label: 'pokémon', value: [], key: 'number' },
            }]);
          });
        });
      });
    });

    describe('output', () => {
      it('success', async () => {
        const starterPokemon = faker.random.number({ min: 1, max: 151 });

        const basePokemons = {
          number: starterPokemon,
          isActive: faker.random.boolean(),
          hasBase: faker.random.boolean(),
          fullyEvolved: faker.random.boolean(),
        };

        const baseInput = {
          _id: new ObjectId().toString(),
          user: new ObjectId().toString(),
          game: new ObjectId().toString(),
          starterPokemon,
          pokemons: [{
            ...basePokemons,
            pokemonsAdditional: 'field',
          }],
          additional: 'field',
        };
        const { value, error } = await release.delete.out.validate(baseInput, options);

        expect(value).toHaveProperty('_id', baseInput._id);
        expect(value).toHaveProperty('user', baseInput.user);
        expect(value).toHaveProperty('starterPokemon', starterPokemon);
        expect(value).toHaveProperty('pokemons', [basePokemons]);
        expect(value).toHaveProperty('game', baseInput.game);

        expect(value).not.toHaveProperty('additional');
        expect(value).not.toHaveProperty('pokemons.pokemonsAdditional');

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        describe('required', () => {
          it('base fields', async () => {
            const { error } = await release.delete.out.validate({}, options);

            expect(error).toHaveProperty('message', '"id" é obrigatório. "pokémon inicial" é obrigatório. "id do jogo" é obrigatório. "id do usuário" é obrigatório. "lista de pokémons" é obrigatório');
            expect(error).toHaveProperty('details', [{
              message: '"id" é obrigatório', path: ['_id'], type: 'any.required', context: { label: 'id', key: '_id' },
            },
            {
              message: '"pokémon inicial" é obrigatório', path: ['starterPokemon'], type: 'any.required', context: { label: 'pokémon inicial', key: 'starterPokemon' },
            },
            {
              message: '"id do jogo" é obrigatório', path: ['game'], type: 'any.required', context: { label: 'id do jogo', key: 'game' },
            },
            {
              message: '"id do usuário" é obrigatório', path: ['user'], type: 'any.required', context: { label: 'id do usuário', key: 'user' },
            },
            {
              message: '"lista de pokémons" é obrigatório', path: ['pokemons'], type: 'any.required', context: { label: 'lista de pokémons', key: 'pokemons' },
            }]);
          });

          it('inner', async () => {
            const starterPokemon = faker.random.number({ min: 1, max: 151 });

            const baseInput = {
              _id: new ObjectId().toString(),
              user: new ObjectId().toString(),
              game: new ObjectId().toString(),
              starterPokemon,
              pokemons: [{}],
            };
            const { error } = await release.delete.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"número do pokémon" é obrigatório. "contém pokémon base" é obrigatório. "pokémon completamente evoluido" é obrigatório. "pokémon ativo" é obrigatório');
            expect(error).toHaveProperty('details', [{
              message: '"número do pokémon" é obrigatório', path: ['pokemons', 0, 'number'], type: 'any.required', context: { label: 'número do pokémon', key: 'number' },
            },
            {
              message: '"contém pokémon base" é obrigatório', path: ['pokemons', 0, 'hasBase'], type: 'any.required', context: { label: 'contém pokémon base', key: 'hasBase' },
            },
            {
              message: '"pokémon completamente evoluido" é obrigatório', path: ['pokemons', 0, 'fullyEvolved'], type: 'any.required', context: { label: 'pokémon completamente evoluido', key: 'fullyEvolved' },
            },
            {
              message: '"pokémon ativo" é obrigatório', path: ['pokemons', 0, 'isActive'], type: 'any.required', context: { label: 'pokémon ativo', key: 'isActive' },
            }]);
          });
        });

        it('empty fields', async () => {
          const starterPokemon = faker.random.number({ min: 1, max: 151 });

          const basePokemon = {
            number: starterPokemon,
            isActive: faker.random.boolean(),
            hasBase: faker.random.boolean(),
            fullyEvolved: faker.random.boolean(),
          };

          const baseInput = {
            _id: '',
            user: '',
            starterPokemon,
            pokemons: [basePokemon],
            game: '',
          };

          const { error } = await release.delete.out.validate(baseInput, options);

          expect(error).toHaveProperty('message', '"id" não pode estar vazio. "id do jogo" não pode estar vazio. "id do usuário" não pode estar vazio');
          expect(error).toHaveProperty('details', [{
            message: '"id" não pode estar vazio', path: ['_id'], type: 'string.empty', context: { label: 'id', value: '', key: '_id' },
          },
          {
            message: '"id do jogo" não pode estar vazio', path: ['game'], type: 'string.empty', context: { label: 'id do jogo', value: '', key: 'game' },
          },
          {
            message: '"id do usuário" não pode estar vazio', path: ['user'], type: 'string.empty', context: { key: 'user', label: 'id do usuário', value: '' },
          }]);
        });

        describe('wrong type', () => {
          it('base fields', async () => {
            const now = new Date().toISOString();

            const baseInput = {
              _id: true,
              user: [],
              starterPokemon: {},
              pokemons: now,
              game: 0,
            };

            const { error } = await release.delete.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"id" deve ser uma string. "pokémon inicial" deve ser um número. "id do jogo" deve ser uma string. "id do usuário" deve ser uma string. "lista de pokémons" deve ser uma lista');
            expect(error).toHaveProperty('details', [{
              message: '"id" deve ser uma string', path: ['_id'], type: 'string.base', context: { label: 'id', value: true, key: '_id' },
            },
            {
              message: '"pokémon inicial" deve ser um número', path: ['starterPokemon'], type: 'number.base', context: { label: 'pokémon inicial', value: {}, key: 'starterPokemon' },
            },
            {
              message: '"id do jogo" deve ser uma string', path: ['game'], type: 'string.base', context: { label: 'id do jogo', value: 0, key: 'game' },
            },
            {
              message: '"id do usuário" deve ser uma string', path: ['user'], type: 'string.base', context: { label: 'id do usuário', value: [], key: 'user' },
            },
            {
              message: '"lista de pokémons" deve ser uma lista', path: ['pokemons'], type: 'array.base', context: { label: 'lista de pokémons', value: now, key: 'pokemons' },
            }]);
          });

          it('inner', async () => {
            const starterPokemon = faker.random.number({ min: 1, max: 151 });

            const now = new Date().toISOString();

            const baseInput = {
              _id: new ObjectId().toString(),
              user: new ObjectId().toString(),
              game: new ObjectId().toString(),
              starterPokemon,
              pokemons: [{
                number: {},
                isActive: 1,
                hasBase: [],
                fullyEvolved: now,
              }],
            };
            const { error } = await release.delete.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"número do pokémon" deve ser um número. "contém pokémon base" deve ser um booleano. "pokémon completamente evoluido" deve ser um booleano. "pokémon ativo" deve ser um booleano');
            expect(error).toHaveProperty('details', [{
              message: '"número do pokémon" deve ser um número', path: ['pokemons', 0, 'number'], type: 'number.base', context: { label: 'número do pokémon', value: {}, key: 'number' },
            },
            {
              message: '"contém pokémon base" deve ser um booleano', path: ['pokemons', 0, 'hasBase'], type: 'boolean.base', context: { label: 'contém pokémon base', value: [], key: 'hasBase' },
            },
            {
              message: '"pokémon completamente evoluido" deve ser um booleano', path: ['pokemons', 0, 'fullyEvolved'], type: 'boolean.base', context: { label: 'pokémon completamente evoluido', value: now, key: 'fullyEvolved' },
            },
            {
              message: '"pokémon ativo" deve ser um booleano', path: ['pokemons', 0, 'isActive'], type: 'boolean.base', context: { label: 'pokémon ativo', value: 1, key: 'isActive' },
            }]);
          });
        });

        describe('lista de pokémons', () => {
          it('min', async () => {
            const starterPokemon = faker.random.number({ min: 1, max: 151 });

            const baseInput = {
              _id: new ObjectId().toString(),
              user: new ObjectId().toString(),
              game: new ObjectId().toString(),
              starterPokemon,
              pokemons: [],
            };

            const { error } = await release.delete.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"lista de pokémons" deve conter pelo menos 1 itens');
            expect(error).toHaveProperty('details', [{
              message: '"lista de pokémons" deve conter pelo menos 1 itens',
              path: ['pokemons'],
              type: 'array.min',
              context: {
                limit: 1, value: [], label: 'lista de pokémons', key: 'pokemons',
              },
            }]);
          });

          it('max', async () => {
            const starterPokemon = faker.random.number({ min: 1, max: 151 });

            const basePokemon = {
              number: starterPokemon,
              isActive: faker.random.boolean(),
              hasBase: faker.random.boolean(),
              fullyEvolved: faker.random.boolean(),
            };

            const baseInput = {
              _id: new ObjectId().toString(),
              user: new ObjectId().toString(),
              game: new ObjectId().toString(),
              starterPokemon,
              pokemons: [
                basePokemon, basePokemon, basePokemon, basePokemon,
                basePokemon, basePokemon, basePokemon, basePokemon,
                basePokemon, basePokemon, basePokemon, basePokemon,
              ],
            };

            const { error } = await release.delete.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"lista de pokémons" deve conter menos que ou igual a 10 itens');
            expect(error).toHaveProperty('details', [{
              message: '"lista de pokémons" deve conter menos que ou igual a 10 itens',
              path: ['pokemons'],
              type: 'array.max',
              context: {
                limit: 10, value: baseInput.pokemons, label: 'lista de pokémons', key: 'pokemons',
              },
            }]);
          });
        });
      });
    });
  });
};

module.exports = runTests;
