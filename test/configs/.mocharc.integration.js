const path = require('path');

const dotEnvPath = path.resolve(__dirname, 'test.env');
require('dotenv').config({ path: dotEnvPath });

module.exports = {
  diff: true,
  sort: true,
  colors: true,
  checkLeaks: true,
  extension: ['js'],
  slow: 1000,
  timeout: 10000,
  exit: true,
  spec: 'test/**/*.js',
  exclude: 'test/unit/**/*.js',
};
