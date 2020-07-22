const CheckPrepare = require('./check-prepare');
const Related = require('./get-related');

const related = new Related();
const checkPrepare = new CheckPrepare();

module.exports = {
  checkPrepare,
  related,
};
