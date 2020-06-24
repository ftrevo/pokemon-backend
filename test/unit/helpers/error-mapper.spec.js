const expect = require('expect');
const ErrorMapper = require('../../../src/helpers/error-mapper');
const { validateDefaultResponse, validateDate } = require('../../test-util');

const getResponseMock = (locals) => ({
  status: (statusCode) => ({
    send: (data) => ({ data, statusCode }),
  }),
  locals,
});

const getSlackMock = (stash) => ({
  notify: (data) => {
    stash.push(data);
  },
});

const getLoggerMock = (stash) => ({
  error: (data) => {
    stash.push({ type: 'error', ...data });
  },
  debug: (data) => {
    stash.push({ type: 'debug', ...data });
  },
});

const localsMock = {
  inboundTime: new Date(),
  requestId: 'a74e36e0-b619-11ea-83d0-85a913277462',
};

const validateSlackStash = (stash, errorMessage) => {
  expect(stash).toHaveLength(1);
  expect(stash).toHaveProperty('0.requestId', localsMock.requestId);
  expect(stash).toHaveProperty('0.errorMessage', errorMessage);
  validateDate(stash[0].errorTime);
  expect(stash).toHaveProperty('0.inboundTime', localsMock.inboundTime.toISOString());
};

const validateLoggerStash = (stash, typeExpected, error, errorMessage) => {
  validateSlackStash(stash, errorMessage || error.message);
  expect(stash).toHaveProperty('0.type', typeExpected);
  expect(stash).toHaveProperty('0.error', error);
};

const runTests = () => {
  describe('Error Mapper', () => {
    it('business error', async () => {
      const stashLogger = [];

      const mapper = new ErrorMapper(getLoggerMock(stashLogger));

      const businessError = {
        isBusiness: true,
        name: 'BusinessError',
        message: 'Random Business Error',
        statusCode: 418,
      };

      const returned = await mapper.handleErrors(
        businessError,
        undefined,
        getResponseMock(localsMock),
      );

      validateLoggerStash(stashLogger, 'debug', businessError);
      validateDefaultResponse(returned.data);
      expect(returned).toHaveProperty('statusCode', businessError.statusCode);
      expect(returned).toHaveProperty('data.message', [businessError.message]);
    });

    it('validation error', async () => {
      const stashLogger = [];

      const mapper = new ErrorMapper(getLoggerMock(stashLogger));

      const businessError = {
        isBusiness: true,
        name: 'ValidationError',
        message: 'Random Validation Error',
        statusCode: 422,
        details: [
          { message: 'Detail 1' },
          { message: 'Detail 2' },
        ],
      };

      const returned = await mapper.handleErrors(
        businessError,
        undefined,
        getResponseMock(localsMock),
      );

      validateLoggerStash(stashLogger, 'debug', businessError, 'Detail 1-Detail 2');
      validateDefaultResponse(returned.data);
      expect(returned).toHaveProperty('statusCode', businessError.statusCode);
      expect(returned).toHaveProperty('data.message', ['Detail 1', 'Detail 2']);
    });

    it('array message error', async () => {
      const stashLogger = [];

      const mapper = new ErrorMapper(getLoggerMock(stashLogger));

      const businessError = {
        isBusiness: true,
        name: 'ArrayMessageError',
        message: ['Array', 'Message', 'Error'],
        statusCode: 418,
      };

      const returned = await mapper.handleErrors(
        businessError,
        undefined,
        getResponseMock(localsMock),
      );

      validateLoggerStash(stashLogger, 'debug', businessError, 'Array-Message-Error');
      validateDefaultResponse(returned.data);
      expect(returned).toHaveProperty('statusCode', businessError.statusCode);
      expect(returned).toHaveProperty('data.message', businessError.message);
    });

    it('internal error', async () => {
      const stashLogger = [];
      const stashSlack = [];

      const mapper = new ErrorMapper(getLoggerMock(stashLogger), getSlackMock(stashSlack));

      const businessError = {
        name: 'InternalError',
        message: 'Random Internal Error',
      };

      const returned = await mapper.handleErrors(
        businessError,
        undefined,
        getResponseMock(localsMock),
      );

      validateSlackStash(stashSlack, businessError.message);
      validateLoggerStash(stashLogger, 'error', businessError);
      validateDefaultResponse(returned.data);
      expect(returned).toHaveProperty('statusCode', 500);
      expect(returned).toHaveProperty('data.message', [businessError.message]);
    });
  });
};

module.exports = runTests;
