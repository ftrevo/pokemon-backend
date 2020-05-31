/**
 * @param request {import('express').Request} Request object.
 * @param response {import('express').Response} Response object.
 */
const internal = (request, response) => {
  const { requestId } = request;

  return response.status(404).send({
    message: 'Requested route was not found at the server',
    date: new Date(),
    requestId,
  });
};

const notFound = (req, res) => internal(req, res);

// --------------------- Module Exports --------------------- //
module.exports = {
  internal,
  notFound,
};
