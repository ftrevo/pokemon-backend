// ------------------- Funções Exportadas ------------------- //
// eslint-disable-next-line no-unused-vars
const handleErrors = function (error, request, response, next) {
  const date = new Date();
  const { requestId } = request;
  console.log('------------------------------');
  console.error(date.toISOString(), requestId, error);
  console.log('------------------------------');

  return response.status(500).send({ message: error.message, requestId, date });
};

// --------------------- Module Exports --------------------- //
module.exports = handleErrors;
