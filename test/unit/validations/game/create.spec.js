/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const faker = require('faker');

const { options } = require('../../../../src/helpers/validator');
const { validations: { '/game': game } } = require('../../../../src/validations');

const runTests = () => {
  describe('Create', () => {
    it('method type and output', async () => {
      expect(game).toHaveProperty('post');
      expect(game).toHaveProperty('post.out');
    });

    describe('output', () => {
      it('success', async () => {
        const baseInput = {
          _id: ObjectId().toHexString(),
          token: 'abcd-1234-e5f6',
          createdAt: faker.date.recent(),
          additional: 'field',
        };

        const { value, error } = await game.post.out.validate(
          baseInput,
          options,
        );

        expect(value).toHaveProperty('_id', baseInput._id);
        expect(value).toHaveProperty('token', baseInput.token);
        expect(value).toHaveProperty('createdAt', baseInput.createdAt);
        expect(value).not.toHaveProperty('additional');

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        it('required fields', async () => {
          const { error } = await game.post.out.validate({}, options);

          expect(error).toHaveProperty('message', '"id" é obrigatório. "token" é obrigatório. "criado em" é obrigatório');
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"id" é obrigatório',
                path: [
                  '_id',
                ],
                type: 'any.required',
                context: {
                  label: 'id',
                  key: '_id',
                },
              },
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
              {
                message: '"criado em" é obrigatório',
                path: [
                  'createdAt',
                ],
                type: 'any.required',
                context: {
                  label: 'criado em',
                  key: 'createdAt',
                },
              },
            ],
          );
        });

        it('empty fields', async () => {
          const { error } = await game.post.out.validate({ _id: '', token: '', createdAt: '' }, options);

          expect(error).toHaveProperty('message', '"id" não pode estar vazio. "token" não pode estar vazio. "criado em" deve estar em formato data ISO 8601');
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"id" não pode estar vazio',
                path: [
                  '_id',
                ],
                type: 'string.empty',
                context: {
                  label: 'id',
                  value: '',
                  key: '_id',
                },
              },
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
              {
                message: '"criado em" deve estar em formato data ISO 8601',
                path: [
                  'createdAt',
                ],
                type: 'date.format',
                context: {
                  format: 'iso',
                  label: 'criado em',
                  value: '',
                  key: 'createdAt',
                },
              },
            ],
          );
        });

        it('invalid type', async () => {
          const { error } = await game.post.out.validate(
            { _id: 1, token: true, createdAt: {} },
            options,
          );

          expect(error).toHaveProperty('message', '"id" deve ser uma string. "token" deve ser uma string. "criado em" deve ser uma data válida');
          expect(error).toHaveProperty('details', [
            {
              message: '"id" deve ser uma string',
              path: [
                '_id',
              ],
              type: 'string.base',
              context: {
                label: 'id',
                value: 1,
                key: '_id',
              },
            },
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
            {
              message: '"criado em" deve ser uma data válida',
              path: [
                'createdAt',
              ],
              type: 'date.base',
              context: {
                label: 'criado em',
                value: {},
                key: 'createdAt',
              },
            },
          ]);
        });
      });
    });
  });
};

module.exports = runTests;
