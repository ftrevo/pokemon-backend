const expect = require('expect');

const validateDate = (candidateDate) => {
  expect.stringMatching(
    candidateDate,
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/,
  );
};

const validateCreatedAt = (data) => {
  expect(data).toHaveProperty('createdAt');
  validateDate(data.createdAt);
};

const validateIdUUIDV1 = (candidateId) => {
  expect.stringMatching(
    candidateId,
    /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  );
};

const validateRequestId = (data) => {
  expect(data).toHaveProperty('requestId');
  validateIdUUIDV1(data.requestId);
};

const validateDefaultResponse = (data) => {
  validateRequestId(data);
  expect(data).toHaveProperty('inboundTime');
  validateDate(data.inboundTime);
  expect(data).toHaveProperty('requestDuration');
  expect(data.requestDuration).toBeGreaterThanOrEqual(0);
};

const validateError = (data) => {
  expect(data).toHaveProperty('message');
  expect(data.message).toBeInstanceOf(Array);
};

module.exports = {
  validateDefaultResponse,
  validateDate,
  validateIdUUIDV1,
  validateError,
  validateRequestId,
  validateCreatedAt,
};
