// ----------------- Import de dependências ----------------- //
const m = require('mongoose');

// --------------- Import de arquivos do core --------------- //
const helper = require('../helpers/utils');
const { status } = require('../controller/server-status');

/**
 *@swagger
 *  /:
 *    get:
 *      summary: Server status
 *      tags: [General]
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/definitions/message'
 *                  - type: object
 *                    properties:
 *                      upTime:
 *                        type: string
 *                      dbStatus:
 *                        type: string
 *        500:
 *          description: Houve um erro inesperado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/definitions/message'
 */
const serverStatus = (req, res) => status(req, res, helper, m);

// --------------------- Module Exports --------------------- //
module.exports = {
  serverStatus,
};
