const express = require('express')
const router = express.Router()
const pedidosDB = require('../db/pedidos');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');

router.get('/', async (req, res) => {
    const session = req.ravenSession;
    try {
        const pedidos = await pedidosDB.find({
            ...req.routerQuery,
            session,
        });
        return res.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const session = req.ravenSession;
    try {
        const pedidos = await pedidosDB.findById({
            id,
            session,
        });
        return res.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        return res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
})

module.exports = router;