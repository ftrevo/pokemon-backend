require('dotenv').config();

const app = require('./src/app');
const { connect, disconnect } = require('./src/helpers/database');
const logger = require('./src/helpers/logger');

// Inicialização do APP
const server = app.listen(process.env.PORT, async () => {
  logger.info(`Servidor inicializado na porta ${process.env.PORT}.`);
  await connect();
});

process.on('SIGINT', async () => {
  await disconnect();
  return server.close();
});
