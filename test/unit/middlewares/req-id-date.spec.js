const expect = require('expect');
const reqIdDate = require('../../../src/middlewares/req-id-date');
const { validateRequestId } = require('../../test-util');

const getResMock = () => ({ locals: {} });
const getNextMock = (stash) => ((nextError) => {
  if (nextError) {
    stash.push(nextError);
  }
});

const runTests = () => {
  describe('Request ID and Date', () => {
    it('success', async () => {
      const stash = [];
      const next = getNextMock(stash);

      const res = getResMock();

      await reqIdDate.genIdDate({}, res, next);

      expect(stash).toHaveLength(0);
      validateRequestId(res.locals);
      expect(res).toHaveProperty('locals.inboundTime');
      expect(res.locals.inboundTime).toBeInstanceOf(Date);
    });
  });
};

module.exports = runTests;
