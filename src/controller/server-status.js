/**
 * @param request {import('express').Request} Request object.
 * @param response {import('express').Response} Response object.
 * @param utils {import('../helpers/utils')} Utils file.
 * @param mongoose {import('mongoose')} Mongoose file.
 */
const status = (request, response, { getReadableUpTime }, mongoose) => {
  const { requestId, currentDate } = request;

  return response.status(200).send(
    {
      message: 'Server is up!',
      date: currentDate.toISOString(),
      requestId,
      upTime: getReadableUpTime(),
      dbState: mongoose.STATES[mongoose.connection.readyState],
    },
  );
};

module.exports = {
  status,
};
