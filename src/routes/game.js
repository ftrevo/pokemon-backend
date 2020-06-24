const GameController = require('../controller/game');

const gameCon = new GameController();

/**
 *@swagger
 *  /game:
 *    post:
 *      summary: Game creation route
 *      tags: [Game]
 *      security:
 *        - authenticationUser: []
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
 *                        $ref: '#/joiComponents/game-post-out'
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
const create = (req, res, next) => gameCon.create(req, res, next);

module.exports = {
  create,
};
