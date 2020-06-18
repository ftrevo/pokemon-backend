const mongoose = require('mongoose');

const connect = async () => {
  mongoose.set('debug', process.env.DEBUG === 'true');
  try {
    await mongoose.connect(
      process.env.DB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      },
    );
    if (process.env.NODE_ENV === 'develop') {
      console.log(new Date().toISOString(), 'Database connected');
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const disconnect = async () => {
  await mongoose.disconnect(process.env.DB_URI);
  if (process.env.NODE_ENV === 'develop') {
    console.log(new Date().toISOString(), 'Database disconnect');
  }
};

module.exports = {
  connect,
  disconnect,
};
