const express = require('express')
const router = express.Router();

const clientesRouter = require('./clientes');
const pedidosRouter = require('./pedidos');

router.use('/clientes', clientesRouter);
router.use('/pedidos', pedidosRouter);

module.exports = router;