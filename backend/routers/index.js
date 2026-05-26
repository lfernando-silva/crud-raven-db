const express = require('express')
const router = express.Router();

const clientesRouter = require('./clientes');
const produtosRouter = require('./produtos');
const pedidosRouter = require('./pedidos');

router.use('/clientes', clientesRouter);
router.use('/pedidos', pedidosRouter);
router.use('/produtos', produtosRouter);

module.exports = router;