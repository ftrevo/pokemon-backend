const expect = require('expect');
const { getRule, validations } = require('../../../src/validations');
const { RouteNotFound, ValidationNotFound } = require('../../../src/domains/errors/exceptions');

describe('# Get Rule Validations - Unit', () => {
  describe('## success', () => {
    it('non swagger', async () => {
      const rule = getRule('/', 'get');

      expect(rule).toHaveProperty('out');
    });

    it('swagger', async () => {
      const rule = getRule('/swagger', 'get');

      expect(rule).toBeUndefined();
    });
  });

  describe('## error', () => {
    it('route not found', async () => {
      try {
        getRule('/not-found', 'get');
      } catch (error) {
        expect(error).toBeInstanceOf(RouteNotFound);
        expect(error).toHaveProperty('message', 'Rota não encontrada');
      }
    });

    it('method for route not found', async () => {
      try {
        getRule('/', 'post');
      } catch (error) {
        expect(error).toBeInstanceOf(RouteNotFound);
        expect(error).toHaveProperty('message', 'Rota não encontrada');
      }
    });

    it('wrong validation', async () => {
      try {
        validations['/random-route'] = { get: {} };

        getRule('/random-route', 'get');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationNotFound);
        expect(error).toHaveProperty('message', 'Validação do payload de saída não encontrado');
      }
    });
  });
});
