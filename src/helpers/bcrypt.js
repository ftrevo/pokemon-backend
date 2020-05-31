const { genSaltSync, hashSync } = require('bcryptjs');

const salt = genSaltSync(12);

const genHash = (data) => hashSync(data, salt);

module.exports = {
  genHash,
};
