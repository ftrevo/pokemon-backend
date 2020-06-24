const { verify } = require('jsonwebtoken');
const { getUnauthorized } = require('../domains/errors/exceptions');

const authRequired = async (request, response, next) => {
  try {
    const { headers: { authorization } } = request;

    if (!authorization || !authorization.startsWith(process.env.TOKEN_TYPE)) {
      throw getUnauthorized('Não autorizado');
    }

    const [, token] = authorization.split(' ');

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
