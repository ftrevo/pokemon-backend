/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { Types: { ObjectId } } = require('mongoose');
const expect = require('expect');
const faker = require('faker');

const { validations: { '/game/{token}': join } } = require('../../../../src/validations');
const { options } = require('../../../../src/helpers/validator');
const { getToken } = require('../../../../src/helpers/utils');

const runTests = () => {
  describe('Join', () => {
    it('method type and output', async () => {
      expect(join).toHaveProperty('patch');
      expect(join).toHaveProperty('patch.out');
      expect(join).toHaveProperty('patch.params');
    });

    describe('params', () => {
      it('success', async () => {
        const baseInput = {
          token: getToken(),
          additional: 'field',
        };

        const { value, error } = await join.patch.params.validate(
          baseInput,
          options,
        );

        expect(value).toHaveProperty('token', baseInput.token);
        expect(value).not.toHaveProperty('additional');

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        it('required fields', async () => {
          const { error } = await join.patch.params.validate({}, options);

          expect(error).toHaveProperty('message', '"token" é obrigatório');
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"token" é obrigatório',
                path: [
                  'token',
                ],
                type: 'any.required',
                context: {
                  label: 'token',
                  key: 'token',
                },
              },
            ],
          );
        });

        it('empty fields', async () => {
          const { error } = await join.patch.params.validate({ token: '' }, options);

          expect(error).toHaveProperty('message', '"token" não pode estar vazio');
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"token" não pode estar vazio',
                path: [
                  'token',
                ],
                type: 'string.empty',
                context: {
                  label: 'token',
                  value: '',
                  key: 'token',
                },
              },
            ],
          );
        });

        it('invalid type', async () => {
          const { error } = await join.patch.params.validate({ token: true }, options);

          expect(error).toHaveProperty('message', '"token" deve ser uma string');
          expect(error).toHaveProperty('details', [
            {
              message: '"token" deve ser uma string',
              path: [
                'token',
              ],
              type: 'string.base',
              context: {
                label: 'token',
                value: true,
                key: 'token',
              },
            },
          ]);
        });
      });
    });

    describe('out', () => {
      it('success', async () => {
        const baseInput = {
          _id: new ObjectId().toString(),
          maker: {
            _id: new ObjectId().toString(),
            name: faker.name.findName(),
          },
          players: [
            {
              _id: new ObjectId().toString(),
              name: faker.name.findName(),
            },
            {
              _id: new ObjectId().toString(),
              name: faker.name.findName(),
            },
          ],
          token: getToken(),
          createdAt: new Date(),
        };

        const { value, error } = await join.patch.out.validate(
          { additional: 'field', ...baseInput },
          options,
        );

        expect(value).not.toHaveProperty('additional');
        expect(value).toEqual(baseInput);

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        it('required fields', async () => {
          const { error } = await join.patch.out.validate(
            {},
            options,
          );

          expect(error).toHaveProperty('message', '"id" é obrigatório. "maker" é obrigatório. "players" é obrigatório. "token" é obrigatório. "criado em" é obrigatório');
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"id" é obrigatório', path: ['_id'], type: 'any.required', context: { label: 'id', key: '_id' },
              },
              {
                message: '"maker" é obrigatório', path: ['maker'], type: 'any.required', context: { label: 'maker', key: 'maker' },
              },
              {
                message: '"players" é obrigatório', path: ['players'], type: 'any.required', context: { label: 'players', key: 'players' },
              },
              {
                message: '"token" é obrigatório', path: ['token'], type: 'any.required', context: { label: 'token', key: 'token' },
              },
              {
                message: '"criado em" é obrigatório', path: ['createdAt'], type: 'any.required', context: { label: 'criado em', key: 'createdAt' },
              },
            ],
          );
        });
      });

      it('empty fields', async () => {
        const { error } = await join.patch.out.validate(
          {
            _id: '', maker: { _id: '', name: '' }, players: [{ _id: '', name: '' }], token: '', createdAt: new Date(),
          },
          options,
        );

        expect(error).toHaveProperty('message', '"id" não pode estar vazio. "id do criador" não pode estar vazio. "nome" não pode estar vazio. "id do jogador" não pode estar vazio. "token" não pode estar vazio');
        expect(error).toHaveProperty(
          'details',
          [
            {
              message: '"id" não pode estar vazio', path: ['_id'], type: 'string.empty', context: { label: 'id', value: '', key: '_id' },
            },
            {
              message: '"id do criador" não pode estar vazio', path: ['maker', '_id'], type: 'string.empty', context: { label: 'id do criador', value: '', key: '_id' },
            },
            {
              message: '"nome" não pode estar vazio', path: ['maker', 'name'], type: 'string.empty', context: { label: 'nome', value: '', key: 'name' },
            },
            {
              message: '"id do jogador" não pode estar vazio', path: ['players', 0, '_id'], type: 'string.empty', context: { label: 'id do jogador', value: '', key: '_id' },
            },
            {
              message: '"nome" não pode estar vazio', path: ['players', 0, 'name'], type: 'string.empty', context: { label: 'nome', value: '', key: 'name' },
            },
            {
              message: '"token" não pode estar vazio', path: ['token'], type: 'string.empty', context: { label: 'token', value: '', key: 'token' },
            },
          ],
        );
      });
    });

    it('invalid type', async () => {
      const { error } = await join.patch.out.validate(
        {
          _id: true, maker: { _id: 1, name: [] }, players: [{ _id: {}, name: false }], token: [], createdAt: '',
        },
        options,
      );

      expect(error).toHaveProperty('message', '"id" deve ser uma string. "id do criador" deve ser uma string. "nome" deve ser uma string. "id do jogador" deve ser uma string. "token" deve ser uma string. "criado em" deve estar em formato data ISO 8601');
      expect(error).toHaveProperty(
        'details',
        [
          {
            message: '"id" deve ser uma string', path: ['_id'], type: 'string.base', context: { label: 'id', value: true, key: '_id' },
          },
          {
            message: '"id do criador" deve ser uma string', path: ['maker', '_id'], type: 'string.base', context: { label: 'id do criador', value: 1, key: '_id' },
          },
          {
            message: '"nome" deve ser uma string', path: ['maker', 'name'], type: 'string.base', context: { label: 'nome', value: [], key: 'name' },
          },
          {
            message: '"id do jogador" deve ser uma string', path: ['players', 0, '_id'], type: 'string.base', context: { label: 'id do jogador', value: {}, key: '_id' },
          },
          {
            message: '"nome" deve ser uma string', path: ['players', 0, 'name'], type: 'string.base', context: { label: 'nome', value: false, key: 'name' },
          },
          {
            message: '"token" deve ser uma string', path: ['token'], type: 'string.base', context: { label: 'token', value: [], key: 'token' },
          },
          {
            message: '"criado em" deve estar em formato data ISO 8601',
            path: ['createdAt'],
            type: 'date.format',
            context: {
              format: 'iso', label: 'criado em', value: '', key: 'createdAt',
            },
          },
        ],
      );
    });
  });
};

module.exports = runTests;
