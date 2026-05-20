const express = require('express')
const router = express.Router();

const clientesRouter = require('./clientes');

router.use('/clientes', clientesRouter);

module.exports = router;