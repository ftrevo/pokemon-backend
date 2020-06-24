/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { Types: { ObjectId } } = require('mongoose');
const expect = require('expect');
const faker = require('faker');

const { options } = require('../../../../src/helpers/validator');
const { validations: { '/user/sign-up': signUp } } = require('../../../../src/validations');

const runTests = () => {
  describe('Sign-up', () => {
    it('method type, input and output', async () => {
      expect(signUp).toHaveProperty('post');
      expect(signUp.post).toHaveProperty('body');
      expect(signUp.post).toHaveProperty('out');
    });

    describe('input', () => {
      it('success', async () => {
        const baseInput = {
          name: faker.name.findName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          additional: 'field',
        };
        const { value, error } = await signUp.post.body.validate(baseInput, options);

        expect(value).toHaveProperty('name', baseInput.name);
        expect(value).toHaveProperty('password', baseInput.password);
        expect(value).toHaveProperty('email', baseInput.email);

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        it('required fields', async () => {
          const { error } = await signUp.post.body.validate({}, options);

          expect(error).toHaveProperty('message', '"nome" é obrigatório. "senha" é obrigatório. "e-mail" é obrigatório');
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"nome" é obrigatório',
                path: ['name'],
                type: 'any.required',
                context: { label: 'nome', key: 'name' },
              },
              {
                message: '"senha" é obrigatório',
                path: ['password'],
                type: 'any.required',
                context: { label: 'senha', key: 'password' },
              },
              {
                message: '"e-mail" é obrigatório',
                path: ['email'],
                type: 'any.required',
                context: { label: 'e-mail', key: 'email' },
              },
            ],
          );
        });

        it('empty fields', async () => {
          const { error } = await signUp.post.body.validate(
            {
              name: '',
              password: '',
              email: '',
            },
            options,
          );

          expect(error).toHaveProperty('message', '"nome" não pode estar vazio. "senha" não pode estar vazio. "e-mail" não pode estar vazio');
          expect(error).toHaveProperty(
            'details',
            [{
              message: '"nome" não pode estar vazio',
              path: ['name'],
              type: 'string.empty',
              context: { label: 'nome', value: '', key: 'name' },
            }, {
              message: '"senha" não pode estar vazio',
              path: ['password'],
              type: 'string.empty',
              context: { label: 'senha', value: '', key: 'password' },
            }, {
              message: '"e-mail" não pode estar vazio',
              path: ['email'],
              type: 'string.empty',
              context: { label: 'e-mail', value: '', key: 'email' },
            }],
          );
        });

        it('invalid type', async () => {
          const { error } = await signUp.post.body.validate(
            {
              name: 1,
              password: true,
              email: [],
            },
            options,
          );

          expect(error).toHaveProperty('message', '"nome" deve ser uma string. "senha" deve ser uma string. "e-mail" deve ser uma string');
          expect(error).toHaveProperty(
            'details',
            [{
              message: '"nome" deve ser uma string',
              path: ['name'],
              type: 'string.base',
              context: { label: 'nome', value: 1, key: 'name' },
            },
            {
              message: '"senha" deve ser uma string',
              path: ['password'],
              type: 'string.base',
              context: { label: 'senha', value: true, key: 'password' },
            },
            {
              message: '"e-mail" deve ser uma string',
              path: ['email'],
              type: 'string.base',
              context: { label: 'e-mail', value: [], key: 'email' },
            }],
          );
        });

        it('min password length', async () => {
          const { error } = await signUp.post.body.validate(
            {
              password: 'a',
              name: faker.name.findName(),
              email: faker.internet.email(),
            },
            options,
          );

          expect(error).toHaveProperty('message', '"senha" o comprimento deve ter pelo menos 4 caracteres');
          expect(error).toHaveProperty(
            'details',
            [{
              message: '"senha" o comprimento deve ter pelo menos 4 caracteres',
              path: ['password'],
              type: 'string.min',
              context: {
                limit: 4, value: 'a', label: 'senha', key: 'password',
              },
            }],
          );
        });
      });
    });

    describe('output', () => {
      it('success', async () => {
        const baseInput = {
          _id: ObjectId().toHexString(),
          name: faker.internet.password(),
          email: faker.internet.email(),
          createdAt: faker.date.recent(),
          additional: 'field',
        };

        const { value, error } = await signUp.post.out.validate(baseInput, options);

        expect(value).toHaveProperty('_id', baseInput._id);
        expect(value).toHaveProperty('name', baseInput.name);
        expect(value).toHaveProperty('password', baseInput.password);
        expect(value).toHaveProperty('createdAt', baseInput.createdAt);

        expect(value).not.toHaveProperty('additional');

        expect(error).toBeUndefined();
      });

      describe('error', () => {
        it('required fields', async () => {
          const { error } = await signUp.post.out.validate({}, options);

          expect(error).toHaveProperty('message', '"id" é obrigatório. "nome" é obrigatório. "e-mail" é obrigatório. "criado em" é obrigatório');
          expect(error).toHaveProperty(
            'details',
            [{
              message: '"id" é obrigatório',
              path: ['_id'],
              type: 'any.required',
              context: { label: 'id', key: '_id' },
            },
            {
              message: '"nome" é obrigatório',
              path: ['name'],
              type: 'any.required',
              context: { label: 'nome', key: 'name' },
            },
            {
              message: '"e-mail" é obrigatório',
              path: ['email'],
              type: 'any.required',
              context: { label: 'e-mail', key: 'email' },
            },
            {
              message: '"criado em" é obrigatório',
              path: ['createdAt'],
              type: 'any.required',
              context: { label: 'criado em', key: 'createdAt' },
            }],
          );
        });

        it('empty fields', async () => {
          const { error } = await signUp.post.out.validate(
            {
              name: '',
              _id: '',
              email: '',
              createdAt: '',
            },
            options,
          );
          expect(error).toHaveProperty(
            'message',
            '"id" não pode estar vazio. "nome" não pode estar vazio. "e-mail" não pode estar vazio. "criado em" deve estar em formato data ISO 8601',
          );
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"id" não pode estar vazio',
                path: ['_id'],
                type: 'string.empty',
                context: { label: 'id', value: '', key: '_id' },
              },
              {
                message: '"nome" não pode estar vazio',
                path: ['name'],
                type: 'string.empty',
                context: { label: 'nome', value: '', key: 'name' },
              },
              {
                message: '"e-mail" não pode estar vazio',
                path: ['email'],
                type: 'string.empty',
                context: { label: 'e-mail', value: '', key: 'email' },
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

        it('invalid type', async () => {
          const { error } = await signUp.post.out.validate(
            {
              name: 1,
              _id: true,
              email: [],
              createdAt: {},
            },
            options,
          );

          expect(error).toHaveProperty(
            'message',
            '"id" deve ser uma string. "nome" deve ser uma string. "e-mail" deve ser uma string. "criado em" deve ser uma data válida',
          );
          expect(error).toHaveProperty(
            'details',
            [
              {
                message: '"id" deve ser uma string',
                path: ['_id'],
                type: 'string.base',
                context: { label: 'id', value: true, key: '_id' },
              },
              {
                message: '"nome" deve ser uma string',
                path: ['name'],
                type: 'string.base',
                context: { label: 'nome', value: 1, key: 'name' },
              },
              {
                message: '"e-mail" deve ser uma string',
                path: ['email'],
                type: 'string.base',
                context: { label: 'e-mail', value: [], key: 'email' },
              },
              {
                message: '"criado em" deve ser uma data válida',
                path: ['createdAt'],
                type: 'date.base',
                context: { label: 'criado em', value: {}, key: 'createdAt' },
              }],
          );
        });
      });
    });
  });
};

module.exports = runTests;
