/**
 * @param {import('express').Request} request Request object.
 * @param {import('express').Response} response Response object.
 * @param {import('express').NextFunction} next Next function.
 * @param {import('../../business-rules/user')} rules Rules applied
 * @param {import('../../helpers/validator')} validate Validator Function
 * @param {import('../../validations/user/user.joi')} userVal Validations applied for User
 * @param {import('../../repository/user')} userRepo Repository for User
 */
const signUpCon = async (
  request,
  response,
  next,
  rules,
  validate,
  { userCreateIn, userCreateOut },
  userRepo,
) => {
  try {
    const { body, requestId, currentDate } = request;

    const sanitized = validate(userCreateIn, body);

    await rules.existsCreate({ email: sanitized.email });

    const user = await userRepo.create(sanitized);

    validate(userCreateOut, user);

    response.status(200).send({ data: user, date: currentDate.toISOString(), requestId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUpCon,
};
