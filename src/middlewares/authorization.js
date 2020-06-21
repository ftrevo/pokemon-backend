const { verify } = require('jsonwebtoken');
const { getUnauthorized } = require('../domains/errors/exceptions');

const authRequired = async (request, response, next) => {
  try {
    const { headers: { Authorization } } = request;

    if (!Authorization || !Authorization.startsWith(process.env.TOKEN_TYPE)) {
      throw getUnauthorized('Não autorizado');
    }

    const [, token] = Authorization.split(' ');

    let decoded;
    try {
      decoded = await verify(token, process.env.SECRET);
    } catch (decodingError) {
      const exception = getUnauthorized('Não autorizado');
      exception.errorDecoding = decodingError.message;
      throw exception;
    }

    response.locals.user = decoded;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authRequired;
