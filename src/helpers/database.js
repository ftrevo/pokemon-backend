const mongoose = require('mongoose');
const logger = require('./logger');

const connect = async () => {
  mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true');
  try {
    await mongoose.connect(
      process.env.DB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      },
    );
    logger.info(`${new Date().toISOString()} - Database connected`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

const disconnect = async () => {
  await mongoose.disconnect(process.env.DB_URI);
  logger.info(`${new Date().toISOString()} - Database disconnected`);
};

module.exports = {
  connect,
  disconnect,
};
