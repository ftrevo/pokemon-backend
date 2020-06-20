const ServerController = require('../controller/server-status');

const serverController = new ServerController();

/**
 *@swagger
 *  /:
 *    get:
 *      summary: Server status
 *      tags: [General]
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/definitions/message'
 *                  - type: object
 *                    properties:
 *                      data:
 *                        $ref: '#/joiComponents/status-out'
 *        500:
 *          description: Unknown internal server error
 *          $ref: '#/definitions/defaultResponse'
 */
const serverStatus = (req, res, next) => serverController.getStatus(req, res, next);

module.exports = {
  serverStatus,
};
