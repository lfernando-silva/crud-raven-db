const Joi = require('joi');
const handler = require('./handler');

const pedidoSchema = Joi.object({
    clienteId: Joi.string().required(),
    itens: Joi.array().items(
        Joi.object({
            produtoId: Joi.string().required(),
            quantidade: Joi.number().integer().min(1).required(),
            precoUnitario: Joi.number().positive().required(),
        })
    ).min(1).required(),
    totalPedido: Joi.number().positive().required(),
});

module.exports = handler(pedidoSchema);