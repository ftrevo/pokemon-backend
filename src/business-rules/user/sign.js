const jwt = require('jsonwebtoken');

const sign = async (user) => {
  const value = await jwt.sign(user, process.env.SECRET);
  return { token: { type: process.env.TOKEN_TYPE, value } };
};

module.exports = sign;
