const expect = require('expect');
const HttpException = require('../../../../src/domains/errors/http-exception');

const runTests = () => {
  describe('HttpException', () => {
    it('default', () => {
      const httpException = new HttpException();

      expect(httpException).toHaveProperty('name', 'HttpException');
      expect(httpException).toHaveProperty('isBusiness', false);
      expect(httpException).toHaveProperty('statusCode', undefined);
      expect(httpException).toHaveProperty('message', undefined);
    });

    it('overwritten', () => {
      const httpException = new HttpException(418, 'I\'m a teapot', 'TeapotException', true);

      expect(httpException).toHaveProperty('name', 'TeapotException');
      expect(httpException).toHaveProperty('isBusiness', true);
      expect(httpException).toHaveProperty('statusCode', 418);
      expect(httpException).toHaveProperty('message', 'I\'m a teapot');
    });
  });
};

module.exports = runTests;
