// ----------------- Import de dependências ----------------- //
require('dotenv').config();

const app = require('./src/app');
const { connect, disconnect } = require('./src/helpers/database');

// Inicialização do APP
const server = app.listen(process.env.PORT, async () => {
  console.log(`Servidor inicializado na porta ${process.env.PORT}.`);
  await connect();
});

process.on('SIGINT', async () => {
  await disconnect();
  server.close();
});
