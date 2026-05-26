const Joi = require('joi');
const handler = require('./handler');

const produtoSchema = Joi.object({
  nome: Joi.string().min(3).max(100),
  preco: Joi.number().precision(2).positive(),
  imagem: Joi.string().uri(),
});

module.exports = handler(produtoSchema);