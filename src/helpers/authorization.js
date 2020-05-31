const jwt = require('jsonwebtoken');

const authRequired = async (request, response, next) => {
  try {
    const { headers: { Authorization } } = request;

    if (!Authorization) {
      return response.status(401).send({ auth: false, message: 'mah balls' });
    }

    const [tokenType, token] = Authorization.split(' ');

    if (tokenType !== process.env.TOKEN_TYPE) {
      return response.status(401).send({ auth: false, message: 'mah balls' });
    }

    const decoded = await jwt.verify(token, process.env.SECRET);

    request.user = decoded;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authRequired,
};
