const swaggerJsdoc = require('swagger-jsdoc');

/* istanbul ignore next */
const caseInsensitive = () => ({
  fn: {
    opsFilter:
      (taggedOps, phrase) => taggedOps.filter(
        (tagObj, tag) => tag.toLowerCase().indexOf(phrase.toLowerCase()) !== -1,
      ),
  },
});

const swaggerSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'pkm-backend',
      version: '1.0.0',
      description: 'API pkm.',
    },
  },
  apis: ['src/routes/**/*.js'], // Rotas a partir da origem do projeto
});

const options = {
  swaggerOptions: {
    filter: true,
    operationsSorter: 'alpha',
    docExpansion: 'none',
    plugins: [
      caseInsensitive,
    ],
  },
};

module.exports = {
  swaggerSpecification,
  options,
};
