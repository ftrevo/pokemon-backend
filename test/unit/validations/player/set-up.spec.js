/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');

const { options } = require('../../../../src/helpers/validator');
const { validations: { '/player': setUp } } = require('../../../../src/validations');

const runTests = () => {
  describe('Setup', () => {
    it('method type, input and output', async () => {
      expect(setUp).toHaveProperty('post');
      expect(setUp).toHaveProperty('post.body');
      expect(setUp).toHaveProperty('post.out');
    });

    describe('input', () => {
      it('success', async () => {
        const baseInput = {
          starterPokemon: faker.random.number({ min: 1, max: 151 }),
          game: new ObjectId().toString(),
          additional: 'field',
        };
        const { value, error } = await setUp.post.body.validate(baseInput, options);

        expect(value).toHaveProperty('starterPokemon', baseInput.starterPokemon);
        expect(value).toHaveProperty('game', baseInput.game);

        expect(value).not.toHaveProperty('additional');

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        it('required fields', async () => {
          const { error } = await setUp.post.body.validate({}, options);

          expect(error).toHaveProperty('message', '"pokémon inicial" é obrigatório. "id do jogo" é obrigatório');
          expect(error).toHaveProperty('details', [
            {
              message: '"pokémon inicial" é obrigatório',
              path: ['starterPokemon'],
              type: 'any.required',
              context: { label: 'pokémon inicial', key: 'starterPokemon' },
            },
            {
              message: '"id do jogo" é obrigatório',
              path: ['game'],
              type: 'any.required',
              context: { label: 'id do jogo', key: 'game' },
            }]);
        });

        it('empty fields', async () => {
          const { error } = await setUp.post.body.validate({ game: '', starterPokemon: 1 }, options);

          expect(error).toHaveProperty('message', '"id do jogo" não pode estar vazio');
          expect(error).toHaveProperty('details', [{
            message: '"id do jogo" não pode estar vazio',
            path: ['game'],
            type: 'string.empty',
            context: { label: 'id do jogo', value: '', key: 'game' },
          }]);
        });

        it('invalid type', async () => {
          const { error } = await setUp.post.body.validate({
            starterPokemon: [],
            game: {},
          }, options);

          expect(error).toHaveProperty('message', '"pokémon inicial" deve ser um número. "id do jogo" deve ser uma string');
          expect(error).toHaveProperty('details', [
            {
              message: '"pokémon inicial" deve ser um número',
              path: ['starterPokemon'],
              type: 'number.base',
              context: { label: 'pokémon inicial', value: [], key: 'starterPokemon' },
            },
            {
              message: '"id do jogo" deve ser uma string',
              path: ['game'],
              type: 'string.base',
              context: { label: 'id do jogo', value: {}, key: 'game' },
            }]);
        });

        describe('pokemon', () => {
          it('min', async () => {
            const baseInput = {
              starterPokemon: -1,
              game: new ObjectId().toString(),
            };
            const { error } = await setUp.post.body.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"pokémon inicial" deve ser maior ou igual a 1');
            expect(error).toHaveProperty('details', [
              {
                message: '"pokémon inicial" deve ser maior ou igual a 1',
                path: ['starterPokemon'],
                type: 'number.min',
                context: {
                  limit: 1, value: -1, label: 'pokémon inicial', key: 'starterPokemon',
                },
              }]);
          });

          it('max', async () => {
            const baseInput = {
              starterPokemon: 999,
              game: new ObjectId().toString(),
            };
            const { error } = await setUp.post.body.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"pokémon inicial" deve ser menor ou igual a 151');
            expect(error).toHaveProperty('details', [
              {
                message: '"pokémon inicial" deve ser menor ou igual a 151',
                path: ['starterPokemon'],
                type: 'number.max',
                context: {
                  limit: 151, value: 999, label: 'pokémon inicial', key: 'starterPokemon',
                },
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

        const baseMaker = {
          _id: new ObjectId().toString(),
          name: faker.name.findName(),
        };

        const baseGame = {
          _id: new ObjectId().toString(),
          maker: {
            ...baseMaker,
            makerAdditional: 'field',
          },
        };

        const baseInput = {
          _id: new ObjectId().toString(),
          user: new ObjectId().toString(),
          starterPokemon,
          pokemons: [{
            ...basePokemons,
            pokemonsAdditional: 'field',
          }],
          game: {
            ...baseGame,
            gameAdditional: 'field',
          },
          additional: 'field',
        };
        const { value, error } = await setUp.post.out.validate(baseInput, options);

        expect(value).toHaveProperty('_id', baseInput._id);
        expect(value).toHaveProperty('user', baseInput.user);
        expect(value).toHaveProperty('starterPokemon', starterPokemon);
        expect(value).toHaveProperty('pokemons', [basePokemons]);
        expect(value).toHaveProperty('game._id', baseGame._id);
        expect(value).toHaveProperty('game.maker', baseMaker);

        expect(value).not.toHaveProperty('additional');
        expect(value).not.toHaveProperty('game.gameAdditional');
        expect(value).not.toHaveProperty('game.maker.makerAdditional');
        expect(value).not.toHaveProperty('pokemons.pokemonsAdditional');

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        describe('required', () => {
          it('base fields', async () => {
            const { error } = await setUp.post.out.validate({}, options);

            expect(error).toHaveProperty('message', '"id" é obrigatório. "pokémon inicial" é obrigatório. "jogo" é obrigatório. "id do usuário" é obrigatório. "lista de pokémons" é obrigatório');
            expect(error).toHaveProperty('details', [{
              message: '"id" é obrigatório', path: ['_id'], type: 'any.required', context: { label: 'id', key: '_id' },
            },
            {
              message: '"pokémon inicial" é obrigatório', path: ['starterPokemon'], type: 'any.required', context: { label: 'pokémon inicial', key: 'starterPokemon' },
            },
            {
              message: '"jogo" é obrigatório', path: ['game'], type: 'any.required', context: { label: 'jogo', key: 'game' },
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
              starterPokemon,
              game: {},
              pokemons: [{}],
            };
            const { error } = await setUp.post.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"id do jogo" é obrigatório. "criador" é obrigatório. "número do pokémon" é obrigatório. "contém pokémon base" é obrigatório. "pokémon completamente evoluido" é obrigatório. "pokémon ativo" é obrigatório');
            expect(error).toHaveProperty('details', [{
              message: '"id do jogo" é obrigatório', path: ['game', '_id'], type: 'any.required', context: { label: 'id do jogo', key: '_id' },
            },
            {
              message: '"criador" é obrigatório', path: ['game', 'maker'], type: 'any.required', context: { label: 'criador', key: 'maker' },
            },
            {
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

          const baseInput = {
            _id: '',
            user: '',
            starterPokemon,
            pokemons: [],
            game: {
              _id: '',
              maker: {
                _id: '',
                name: '',
              },
            },
          };

          const { error } = await setUp.post.out.validate(baseInput, options);

          expect(error).toHaveProperty('message', '"id" não pode estar vazio. "id do jogo" não pode estar vazio. "id do criador" não pode estar vazio. "nome" não pode estar vazio. "id do usuário" não pode estar vazio. "lista de pokémons" deve conter 1 itens');
          expect(error).toHaveProperty('details', [{
            message: '"id" não pode estar vazio', path: ['_id'], type: 'string.empty', context: { label: 'id', value: '', key: '_id' },
          },
          {
            message: '"id do jogo" não pode estar vazio', path: ['game', '_id'], type: 'string.empty', context: { label: 'id do jogo', value: '', key: '_id' },
          }, {
            message: '"id do criador" não pode estar vazio', path: ['game', 'maker', '_id'], type: 'string.empty', context: { label: 'id do criador', value: '', key: '_id' },
          },
          {
            message: '"nome" não pode estar vazio', path: ['game', 'maker', 'name'], type: 'string.empty', context: { label: 'nome', value: '', key: 'name' },
          },
          {
            message: '"id do usuário" não pode estar vazio', path: ['user'], type: 'string.empty', context: { label: 'id do usuário', value: '', key: 'user' },
          },
          {
            message: '"lista de pokémons" deve conter 1 itens',
            path: ['pokemons'],
            type: 'array.length',
            context: {
              limit: 1, value: [], label: 'lista de pokémons', key: 'pokemons',
            },
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

            const { error } = await setUp.post.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"id" deve ser uma string. "pokémon inicial" deve ser um número. "jogo" deve ser do tipo object. "id do usuário" deve ser uma string. "lista de pokémons" deve ser uma lista');
            expect(error).toHaveProperty('details', [{
              message: '"id" deve ser uma string', path: ['_id'], type: 'string.base', context: { label: 'id', value: true, key: '_id' },
            },
            {
              message: '"pokémon inicial" deve ser um número', path: ['starterPokemon'], type: 'number.base', context: { label: 'pokémon inicial', value: {}, key: 'starterPokemon' },
            },
            {
              message: '"jogo" deve ser do tipo object',
              path: ['game'],
              type: 'object.base',
              context: {
                type: 'object', label: 'jogo', value: 0, key: 'game',
              },
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
              starterPokemon,
              pokemons: [{
                number: {},
                isActive: 1,
                hasBase: [],
                fullyEvolved: now,
              }],
              game: {
                _id: 0,
                maker: {
                  _id: true,
                  name: false,
                },
              },
            };
            const { error } = await setUp.post.out.validate(baseInput, options);

            expect(error).toHaveProperty('message', '"id do jogo" deve ser uma string. "id do criador" deve ser uma string. "nome" deve ser uma string. "número do pokémon" deve ser um número. "contém pokémon base" deve ser um booleano. "pokémon completamente evoluido" deve ser um booleano. "pokémon ativo" deve ser um booleano');
            expect(error).toHaveProperty('details', [{
              message: '"id do jogo" deve ser uma string', path: ['game', '_id'], type: 'string.base', context: { label: 'id do jogo', value: 0, key: '_id' },
            },
            {
              message: '"id do criador" deve ser uma string', path: ['game', 'maker', '_id'], type: 'string.base', context: { label: 'id do criador', value: true, key: '_id' },
            },
            {
              message: '"nome" deve ser uma string', path: ['game', 'maker', 'name'], type: 'string.base', context: { label: 'nome', value: false, key: 'name' },
            },
            {
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
      });
    });
  });
};

module.exports = runTests;
