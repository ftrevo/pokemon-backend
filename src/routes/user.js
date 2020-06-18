// ----------------- Import de dependências ----------------- //
const UserController = require('../controller/user');

const userCon = new UserController();

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
 *              $ref: '#/joiComponents/sign-up-body'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/definitions/general'
 *                  - type: object
 *                    properties:
 *                      data:
 *                        $ref: '#/joiComponents/sign-up-out'
 *        400:
 *          description: Input data exception
 *          $ref: '#/definitions/defaultResponse'
 *        422:
 *          description: Business exception
 *          $ref: '#/definitions/defaultResponse'
 *        500:
 *          description: Unknown internal server error
 *          $ref: '#/definitions/defaultResponse'
 *        533:
 *          description: Output data exception
 *          $ref: '#/definitions/defaultResponse'
 */
const create = (req, res, next) => userCon.signUp(req, res, next);

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
 *              $ref: '#/joiComponents/sign-in-body'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/definitions/general'
 *                  - type: object
 *                    properties:
 *                      data:
 *                        $ref: '#/joiComponents/sign-in-out'
 *        401:
 *          description: Business exception
 *          $ref: '#/definitions/defaultResponse'
 *        500:
 *          description: Unknown internal server error
 *          $ref: '#/definitions/defaultResponse'
 */
const logIn = (req, res, next) => userCon.signIn(req, res, next);

// --------------------- Module Exports --------------------- //
module.exports = {
  create,
  logIn,
};
