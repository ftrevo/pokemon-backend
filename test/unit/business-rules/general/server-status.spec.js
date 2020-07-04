const expect = require('expect');
const ServerStatus = require('../../../../src/business-rules/general/server-status');

const runTests = () => {
  describe('Server Status', () => {
    const getMockedDb = (readyState) => ({
      STATES: ['disconnected', 'connected'],
      connection: { readyState },
    });

    it('success', async () => {
      const ss = new ServerStatus(getMockedDb(1));

      const status = await ss.get();

      expect(status).toHaveProperty('message', 'Server is up!');
      expect(status).toHaveProperty('dbState', 'connected');
      expect(status).toHaveProperty('upTime');
      expect(status.upTime).toMatch(/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9]$/);
    });
  });
};

module.exports = runTests;
