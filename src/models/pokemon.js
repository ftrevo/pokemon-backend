const { Schema, model } = require('mongoose');

const schemaObj = {
  name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  deviceInfo: {
    type: String,
    trim: true,
  },
};

const PlayerSchema = new Schema(schemaObj, { versionKey: false, timestamps: true });

module.exports = model('Player', PlayerSchema);
