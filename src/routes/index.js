const { serverStatus } = require('./server-status');
const { create, logIn } = require('./user');

/**
 * TAG LIST
 * @swagger
 *  tags:
 *    - name: General
 *      description: General endpoints such as server status.
 *    - name: User
 *      description: User endpoints.
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
  app.route('/user/sign-up').post(create);
  app.route('/user/sign-in').post(logIn);

  app.route('/').get(serverStatus);
};

module.exports = routes;
