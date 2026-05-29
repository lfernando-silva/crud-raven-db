const Joi = require('joi');
const handler = require('./handler');

const clienteSchema = Joi.object({
  nome: Joi.string().min(3).max(100),
  email: Joi.string().email(),
  instagram: Joi.string().min(5).max(40),
  telefone: Joi.array().items(Joi.string()),
  endereco: Joi.string().min(10).max(200),
});

module.exports = handler(clienteSchema);