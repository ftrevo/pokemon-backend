/**
 * @param {import('express').Request} request Request object.
 * @param {import('express').Response} response Response object.
 * @param {import('express').NextFunction} next Next function.
 * @param {import('../../business-rules/user')} rules Rules applied
 * @param {import('../../helpers/validator')} validate Validator Function
 * @param {import('../../validations/user/user.joi')} userVal Validations applied for User
 * @param {import('jsonwebtoken')} jwtLib
 */
const signInCon = async (
  request,
  response,
  next,
  rules,
  validate,
  { userSignInIn, userSignInOut },
  jwtLib,
) => {
  try {
    const { body, requestId, currentDate } = request;

    const { password, email } = validate(userSignInIn, body);

    const user = await rules.getUserValidPwd({ email, password });

    const value = await jwtLib.sign(user, process.env.SECRET);

    const output = {
      type: process.env.TOKEN_TYPE,
      value,
    };

    validate(userSignInOut, output);

    response.status(200).send({ data: output, date: currentDate.toISOString(), requestId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signInCon,
};
