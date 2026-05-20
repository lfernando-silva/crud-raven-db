const express = require('express')
const router = express.Router()
const clientesDB = require('../db/clientes');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');

router.get('/', async (req, res) => {
    const {
        qtd,
        page,
        orderBy,
        projection
    } = req.routerQuery;

    try {
        const clientes = await clientesDB.getClientes(req, {
            qtd,
            page,
            orderBy,
            projection
        });

        return res.json(clientes);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
})

module.exports = router;