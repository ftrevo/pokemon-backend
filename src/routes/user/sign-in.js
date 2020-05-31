const jwt = require('jsonwebtoken');
// ----------------- Import de dependências ----------------- //
const { signInCon } = require('../../controller/user');
const userVal = require('../../validations/user/user.joi');
const userRules = require('../../business-rules/user');
const val = require('../../helpers/validator');

/**
 *@swagger
 *  /user/sign-in:
 *    post:
 *      summary: User sign-in route
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/joiComponents/user-sign-in-in'
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/definitions/general'
 *                  - type: object
 *                    properties:
 *                      data:
 *                        $ref: '#/joiComponents/user-sign-in-out'
 *        500:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/definitions/message'
 */
const signIn = (req, res, next) => signInCon(
  req, res, next,
  userRules, val, userVal, jwt,
);

// --------------------- Module Exports --------------------- //
module.exports = {
  signIn,
};
