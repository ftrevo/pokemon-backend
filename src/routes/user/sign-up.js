// ----------------- Import de dependências ----------------- //
const { signUpCon } = require('../../controller/user');
const userVal = require('../../validations/user/user.joi');
const userRules = require('../../business-rules/user');
const userRepo = require('../../repository/user');
const val = require('../../helpers/validator');

/**
 *@swagger
 *  /user/sign-up:
 *    post:
 *      summary: User creation route
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/joiComponents/user-create-in'
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
 *                        $ref: '#/joiComponents/user-create-out'
 *        500:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/definitions/message'
 */
const create = (req, res, next) => signUpCon(req, res, next, userRules, val, userVal, userRepo);

// --------------------- Module Exports --------------------- //
module.exports = {
  create,
};
