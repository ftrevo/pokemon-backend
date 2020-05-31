// ----------------- Import de dependências ----------------- //

// --------------- Import de arquivos do core --------------- //
const { serverStatus } = require('./server-status');

const { create } = require('./user/sign-up');
const { signIn } = require('./user/sign-in');

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
 *      date:
 *        type: string
 *        format: date-time
 *      requestId:
 *        type: string
 *    message:
 *      allOf:
 *        - $ref: '#/definitions/general'
 *        - type: object
 *          properties:
 *            message:
 *              type: string
 */
const routes = function (app) {
  app.route('/user/sign-up').post(create);
  app.route('/user/sign-in').post(signIn);

  app.route('/').get(serverStatus);
};

// --------------------- Module Exports --------------------- //
module.exports = routes;
