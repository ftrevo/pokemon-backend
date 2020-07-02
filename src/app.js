// ----------------- Import de dependências ----------------- //
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpecification, options } = require('./helpers/swagger-definitions');

// --------------- Import de arquivos do core --------------- //
const joiFilesToSwagger = require('./helpers/swagger-joi-compiler');
const ErrorMapper = require('./middlewares/error-mapper');
const { genIdDate } = require('./middlewares/req-id-date');
const notFound = require('./middlewares/not-found');
const routes = require('./routes');

// Inicialização e configuração do app
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Middleware para definição de requestId
app.use(genIdDate);

// Definição de rotas
routes(app);

// Adição dos arquivos do JOI no contexto do SWAGGER
joiFilesToSwagger(swaggerSpecification, __dirname);

// Handling da Documentação da API
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecification, options));

// Not Found Middleware
app.use(notFound);

// Middeware de erros
app.use(new ErrorMapper().handleErrors);

// --------------------- Module Exports --------------------- //
module.exports = app;
