const expect = require('expect');
const {
  Unprocessable,
  Unauthorized,
  RouteNotFound,
  ValidationNotFound,
  getUnprocessable,
  getUnauthorized,
} = require('../../../../src/domains/errors/exceptions');

const runTests = () => {
  describe('HttpException', () => {
    it('unprocessable', () => {
      const httpException = new Unprocessable('MyMessage');

      expect(httpException).toHaveProperty('name', 'Unprocessable');
      expect(httpException).toHaveProperty('isBusiness', true);
      expect(httpException).toHaveProperty('statusCode', 422);
      expect(httpException).toHaveProperty('message', 'MyMessage');
    });

    it('get unprocessable', () => {
      const httpException = getUnprocessable('GetMyMessage');

      expect(httpException).toHaveProperty('name', 'Unprocessable');
      expect(httpException).toHaveProperty('isBusiness', true);
      expect(httpException).toHaveProperty('statusCode', 422);
      expect(httpException).toHaveProperty('message', 'GetMyMessage');
    });

    it('unauthorized', () => {
      const httpException = new Unauthorized('MyMessage');

      expect(httpException).toHaveProperty('name', 'Unauthorized');
      expect(httpException).toHaveProperty('isBusiness', true);
      expect(httpException).toHaveProperty('statusCode', 401);
      expect(httpException).toHaveProperty('message', 'MyMessage');
    });

    it('get unauthorized', () => {
      const httpException = getUnauthorized('GetMyMessage');

      expect(httpException).toHaveProperty('name', 'Unauthorized');
      expect(httpException).toHaveProperty('isBusiness', true);
      expect(httpException).toHaveProperty('statusCode', 401);
      expect(httpException).toHaveProperty('message', 'GetMyMessage');
    });

    it('routeNotFound', () => {
      const httpException = new RouteNotFound('MyMessage');

      expect(httpException).toHaveProperty('name', 'Not Found');
      expect(httpException).toHaveProperty('isBusiness', true);
      expect(httpException).toHaveProperty('statusCode', 404);
      expect(httpException).toHaveProperty('message', 'MyMessage');
    });

    it('validationNotFound', () => {
      const httpException = new ValidationNotFound('MyMessage');

      expect(httpException).toHaveProperty('name', 'Not Found Validation');
      expect(httpException).toHaveProperty('isBusiness', false);
      expect(httpException).toHaveProperty('statusCode', 500);
      expect(httpException).toHaveProperty('message', 'MyMessage');
    });
  });
};

module.exports = runTests;
