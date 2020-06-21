const { sign } = require('jsonwebtoken');

const getAuth = async (user) => {
  const value = await sign(user, process.env.SECRET);
  return { token: { type: process.env.TOKEN_TYPE, value } };
};

module.exports = getAuth;
