/* eslint-disable no-underscore-dangle */
const expect = require('expect');
const faker = require('faker');

const { options } = require('../../../../src/helpers/validator');
const { '/user/sign-in': signIn } = require('../../../../src/validations');

describe('# Sign-in - Validation', () => {
  it('method type, input and output', async () => {
    expect(signIn).toHaveProperty('post');
    expect(signIn).toHaveProperty('post.body');
    expect(signIn).toHaveProperty('post.out');
  });

  describe('## input', () => {
    describe('### success', () => {
      const baseInput = {
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      it('name password and removing additional fields', async () => {
        const { value, error } = await signIn.post.body.validate({
          ...baseInput,
          additional: 'field',
        }, options);

        expect(value).toHaveProperty('name', baseInput.name);
        expect(value).toHaveProperty('password', baseInput.password);

        expect(value).not.toHaveProperty('additional');

        expect(error).toBeUndefined();
      });
    });

    describe('### error', () => {
      it('required fields', async () => {
        const { error } = await signIn.post.body.validate({}, options);

        expect(error).toHaveProperty('message', '"e-mail" é obrigatório. "senha" é obrigatório');
        expect(error).toHaveProperty('details',
          [
            {
              message: '"e-mail" é obrigatório',
              path: ['email'],
              type: 'any.required',
              context: { label: 'e-mail', key: 'email' },
            },
            {
              message: '"senha" é obrigatório',
              path: ['password'],
              type: 'any.required',
              context: { label: 'senha', key: 'password' },
            },
          ]);
      });

      it('empty fields', async () => {
        const { error } = await signIn.post.body.validate({
          email: '',
          password: '',
        }, options);

        expect(error).toHaveProperty('message', '"e-mail" não pode estar vazio. "senha" não pode estar vazio');
        expect(error).toHaveProperty('details', [
          {
            message: '"e-mail" não pode estar vazio',
            path: ['email'],
            type: 'string.empty',
            context: { label: 'e-mail', value: '', key: 'email' },
          },
          {
            message: '"senha" não pode estar vazio',
            path: ['password'],
            type: 'string.empty',
            context: { label: 'senha', value: '', key: 'password' },
          },
        ]);
      });

      it('invalid type', async () => {
        const { error } = await signIn.post.body.validate({
          email: [],
          password: {},
        }, options);

        expect(error).toHaveProperty('message', '"e-mail" deve ser uma string. "senha" deve ser uma string');
        expect(error).toHaveProperty('details', [
          {
            message: '"e-mail" deve ser uma string',
            path: ['email'],
            type: 'string.base',
            context: { label: 'e-mail', value: [], key: 'email' },
          },
          {
            message: '"senha" deve ser uma string',
            path: ['password'],
            type: 'string.base',
            context: { label: 'senha', value: {}, key: 'password' },
          },
        ]);
      });

      describe('#### password', () => {
        it('min', async () => {
          const { error } = await signIn.post.body.validate(
            {
              password: 'a',
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
  });
  describe('## output', () => {
    describe('### success', () => {
      it('type value and removing additional fields', async () => {
        const baseInput = {
          token: {
            type: 'JWT',
            value: faker.random.alphaNumeric(30),
            additional: 'nested',
          },
          additional: 'field',
        };

        const { value, error } = await signIn.post.out.validate(
          baseInput,
          options,
        );

        expect(value).toHaveProperty('token');
        expect(value).toHaveProperty('token.type', baseInput.token.type);
        expect(value).toHaveProperty('token.value', baseInput.token.value);
        expect(value).not.toHaveProperty('token.additional');
        expect(value).not.toHaveProperty('additional');

        expect(error).toBeUndefined();
      });
    });

    describe('### error', () => {
      it('required fields', async () => {
        const { error } = await signIn.post.out.validate({}, options);

        expect(error).toHaveProperty('message', '"token" é obrigatório');
        expect(error).toHaveProperty(
          'details',
          [
            {
              message: '"token" é obrigatório',
              path: ['token'],
              type: 'any.required',
              context: { label: 'token', key: 'token' },
            },
          ],
        );
      });

      it('required inner fields', async () => {
        const { error } = await signIn.post.out.validate({ token: {} }, options);

        expect(error).toHaveProperty('message', '"tipo do token" é obrigatório. "valor do token" é obrigatório');
        expect(error).toHaveProperty(
          'details',
          [
            {
              message: '"tipo do token" é obrigatório',
              path: ['token', 'type'],
              type: 'any.required',
              context: { label: 'tipo do token', key: 'type' },
            },
            {
              message: '"valor do token" é obrigatório',
              path: ['token', 'value'],
              type: 'any.required',
              context: { label: 'valor do token', key: 'value' },
            },
          ],
        );
      });

      it('empty fields', async () => {
        const { error } = await signIn.post.out.validate({ token: { type: '', value: '' } }, options);

        expect(error).toHaveProperty('message', '"tipo do token" não pode estar vazio. "valor do token" não pode estar vazio');
        expect(error).toHaveProperty(
          'details',
          [
            {
              message: '"tipo do token" não pode estar vazio',
              path: ['token', 'type'],
              type: 'string.empty',
              context: { label: 'tipo do token', value: '', key: 'type' },
            },
            {
              message: '"valor do token" não pode estar vazio',
              path: ['token', 'value'],
              type: 'string.empty',
              context: { label: 'valor do token', value: '', key: 'value' },
            },
          ]
          ,
        );
      });

      it('invalid type', async () => {
        const { error } = await signIn.post.out.validate({ token: 1 }, options);

        expect(error).toHaveProperty('message', '"token" deve ser do tipo object');
        expect(error).toHaveProperty('details', [{
          message: '"token" deve ser do tipo object',
          path: ['token'],
          type: 'object.base',
          context: {
            type: 'object', label: 'token', value: 1, key: 'token',
          },
        }]);
      });

      it('invalid inner type', async () => {
        const { error } = await signIn.post.out.validate(
          { token: { type: true, value: 1 } },
          options,
        );

        expect(error).toHaveProperty('message', '"tipo do token" deve ser uma string. "valor do token" deve ser uma string');
        expect(error).toHaveProperty('details',
          [
            {
              message: '"tipo do token" deve ser uma string',
              path: ['token', 'type'],
              type: 'string.base',
              context: { label: 'tipo do token', value: true, key: 'type' },
            },
            {
              message: '"valor do token" deve ser uma string',
              path: ['token', 'value'],
              type: 'string.base',
              context: { label: 'valor do token', value: 1, key: 'value' },
            },
          ]);
      });
    });
  });
});
