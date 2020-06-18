// ------------------- Funções Exportadas ------------------- //
const getDefaultResData = ({ inboundTime, requestId }) => ({
  inboundTime: inboundTime.toISOString(),
  requestId,
  requestDuration: new Date().getTime() - inboundTime.getTime(),
});

const routeReplacer = /\/[0-9a-fA-F]{24}/;
const untestedRoutes = /^\/swagger(\/)?/;

const getReplacedRouteString = (path) => path.replace(routeReplacer, '/{id}');
const isSwaggerRoute = (path) => untestedRoutes.test(path);

// --------------------- Module Exports --------------------- //
module.exports = {
  getDefaultResData,
  getReplacedRouteString,
  isSwaggerRoute,
};
