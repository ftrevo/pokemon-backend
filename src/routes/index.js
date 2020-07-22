const authRule = require('../middlewares/authorization');
const { serverStatus } = require('./server-status');
const { create: createUser, logIn } = require('./user');
const { create: createGame, join } = require('./game');
const { setUp, capture } = require('./player');

/**
 * TAG LIST
 * @swagger
 *  tags:
 *    - name: General
 *      description: General endpoints such as server status.
 *    - name: User
 *      description: User endpoints.
 *    - name: Game
 *      description: Game endpoints.
 *    - name: Player
 *      description: Player endpoints.
 */

/**
 * SECURITY SCHEMAS
 * @swagger
 * components:
 *   securitySchemes:
 *     authenticationUser:
 *       type: apiKey
 *       name: authorization
 *       in: header
 *       description: Token do usuário
 */

/**
 * GENERAL SCHEMAS
 * @swagger
 *  definitions:
 *    general:
 *     properties:
 *      inboundTime:
 *        type: string
 *        format: date-time
 *      requestId:
 *        type: string
 *      requestDuration:
 *        type: number
 *    message:
 *      allOf:
 *        - $ref: '#/definitions/general'
 *        - type: object
 *          properties:
 *            message:
 *              type: string
 *    defaultResponse:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/definitions/message'
 */
const routes = function (app) {
  app.route('/user/sign-up').post(createUser);
  app.route('/user/sign-in').post(logIn);

  app.route('/game').post(authRule, createGame);
  app.route('/game').patch(authRule, join);

  app.route('/player').post(authRule, setUp);
  app.route('/player/:_id/capture').patch(authRule, capture);

  app.route('/').get(serverStatus);
};

module.exports = routes;
