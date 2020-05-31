const mongoose = require('mongoose');

const connect = async () => {
  mongoose.set('debug', process.env.DEBUG === 'true');
  await mongoose.connect(
    process.env.DB_URI,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  );
  console.log(new Date().toISOString(), 'Database connected');
};

const disconnect = async () => {
  await mongoose.disconnect(process.env.DB_URI);
  console.log(new Date().toISOString(), 'Database disconnect');
};

module.exports = {
  connect,
  disconnect,
};
