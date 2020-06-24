const getDefaultResData = ({ inboundTime, requestId }) => ({
  inboundTime: inboundTime.toISOString(),
  requestId,
  requestDuration: new Date().getTime() - inboundTime.getTime(),
});

const routeReplacer = /\/[0-9a-fA-F]{24}/;
const untestedRoutes = /^\/swagger(\/)?/;
const idRegex = /^[0-9a-fA-F]{24}$/;
const tokenRegex = /^[0-9a-fA-F]{4}(-[0-9a-fA-F]{4}){2}$/;

const getReplacedRouteString = (path) => path.replace(routeReplacer, '/{id}');
const isSwaggerRoute = (path) => untestedRoutes.test(path);

module.exports = {
  getDefaultResData,
  getReplacedRouteString,
  isSwaggerRoute,
  idRegex,
  tokenRegex,
};
