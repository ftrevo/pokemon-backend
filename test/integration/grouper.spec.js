const notFound = require('./not-found.spec');
const serverStatus = require('./server-status.spec');
const game = require('./game/grouper.spec');
const player = require('./player/grouper.spec');
const user = require('./user/grouper.spec');

describe('# Integration', () => {
  notFound();
  serverStatus();
  game();
  player();
  user();
});
