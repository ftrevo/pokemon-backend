const PlayerController = require('../controller/player');

const playerCon = new PlayerController();

/**
 *@swagger
 *  /player:
 *    post:
 *      summary: Player initial set-up route
 *      tags: [Player]
 *      security:
 *        - authenticationUser: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/joiComponents/set-up-post-body'
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
 *                        $ref: '#/joiComponents/set-up-post-out'
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
const setUp = (req, res, next) => playerCon.setUp(req, res, next);

/**
 *@swagger
 *  /player/{_id}/pokemon:
 *    patch:
 *      summary: Player has captured a pokémon
 *      tags: [Player]
 *      security:
 *        - authenticationUser: []
 *      parameters:
 *        - in: path
 *          name: _id
 *          required: true
 *          schema:
 *            $ref: '#/joiComponents/capture-patch-params-id'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/joiComponents/capture-patch-body'
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
 *                        $ref: '#/joiComponents/player-details-out'
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
const capture = (req, res, next) => playerCon.capture(req, res, next);

/**
 *@swagger
 *  /player/{_id}/pokemon/{number}:
 *    delete:
 *      summary: Player is releasing a pokémon
 *      tags: [Player]
 *      security:
 *        - authenticationUser: []
 *      parameters:
 *        - in: path
 *          name: _id
 *          required: true
 *          schema:
 *            $ref: '#/joiComponents/release-delete-params-id'
 *        - in: path
 *          name: number
 *          required: true
 *          schema:
 *            $ref: '#/joiComponents/release-delete-params-number'
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
 *                        $ref: '#/joiComponents/player-details-out'
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
const release = (req, res, next) => playerCon.release(req, res, next);

module.exports = {
  setUp,
  capture,
  release,
};
