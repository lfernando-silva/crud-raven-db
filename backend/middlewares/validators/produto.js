const Joi = require('joi');
const handler = require('./handler');

const produtoSchema = Joi.object({
  nome: Joi.string().min(3).max(100),
  preco: Joi.number().precision(2).positive().greater(0),
  imagem: Joi.string().uri(),
  categoria: Joi.string().min(3).max(50),
});

module.exports = handler(produtoSchema);