const create = require('./create');
const exists = require('./check-exists');
const findOne = require('./find-one');
const findOneAndUpdate = require('./find-one-and-update');

// TODO Transformar em classe para dar extends
module.exports = {
  create,
  exists,
  findOne,
  findOneAndUpdate,
};
