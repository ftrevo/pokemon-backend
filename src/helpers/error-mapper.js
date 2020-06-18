const { getDefaultResData } = require('./utils');

// ------------------- Funções Exportadas ------------------- //
// eslint-disable-next-line no-unused-vars
const getMessage = (error) => {
  if (Array.isArray(error.message)) {
    return error.message;
  }

  if (error.name === 'ValidationError' && Array.isArray(error.details)) {
    return error.details.map((detail) => detail.message);
  }

  return [error.message];
};

// eslint-disable-next-line no-unused-vars
const handleErrors = function (error, request, response, next) {
  const errorTime = new Date();
  const { requestId, inboundTime } = response.locals;

  const message = getMessage(error);

  if (!error.isBusiness) { // TODO Adicionar transporter de logger, winstonjs da vida...
    console.log('------------------------------');
    console.error(`${errorTime.toISOString()} - ${requestId} - ${inboundTime.toISOString()} - ${message}`);
    console.log('------------------------------');
  }

  return response
    .status(error.statusCode || 500)
    .send({ message, ...getDefaultResData(response.locals) });
};

// --------------------- Module Exports --------------------- //
module.exports = handleErrors;
