const businessRules = require('./business-rules/grouper.spec');
const helpers = require('./helpers/grouper.spec');
const middlewares = require('./middlewares/grouper.spec');
const models = require('./models/grouper.spec');
const validations = require('./validations/grouper.spec');

describe('# Unit', () => {
  businessRules();
  helpers();
  middlewares();
  models();
  validations();
});
