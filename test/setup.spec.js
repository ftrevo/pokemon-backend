const { MongoMemoryServer } = require('mongodb-memory-server');
const { connect, disconnect } = require('../src/helpers/database');


let mongoServer;

before(async () => {
  if (process.env.SHOULD_USE_DB === 'true') {
    // Necessário setar o objeto para não criar a URI de maneira dinâmica
    mongoServer = await MongoMemoryServer.create(
      {
        instance: {
          port: 54692,
          dbName: 'memory-server',
        },
        autoStart: true,
      },
    );

    await connect();
  }
});

after(async () => {
  if (mongoServer) {
    await disconnect();
    await mongoServer.stop();
  }
});
