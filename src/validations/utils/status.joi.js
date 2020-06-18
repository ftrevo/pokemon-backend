// ----------------- Import de dependências ----------------- //
const Joi = require('@hapi/joi');

const keys = {
  upTime: Joi.string().trim().regex(/^[0-9]{2,}:[0-9]{2}:[0-9]{2}$/).label('tempo de atividade'),
  message: Joi.string().trim().label('mensagem'),
  dbState: Joi.string().trim().label('estado do banco de dados'),
};

const statusOut = Joi.object().required().keys({
  upTime: keys.upTime.required(),
  message: keys.message.required(),
  dbState: keys.dbState.required(),
}).meta({
  className: 'status-out',
});

// --------------------- Module Exports --------------------- //
module.exports = {
  statusOut,
};
