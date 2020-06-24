const notFound = require('./not-found.spec');
const serverStatus = require('./server-status.spec');
const user = require('./user/grouper.spec');
const game = require('./game/grouper.spec');

describe('# Integration', () => {
  notFound();
  serverStatus();
  user();
  game();
});
