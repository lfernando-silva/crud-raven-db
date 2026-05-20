const express = require('express')
const router = express.Router()
const clientesDB = require('../db/clientes');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');

router.get('/', async (req, res) => {
    const session = req.ravenSession;
    try {
        const clientes = await clientesDB.find({
            ...req.routerQuery,
            session,
        });
        return res.json(clientes);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const session = req.ravenSession;
    try {
        const clientes = await clientesDB.findById({
            id,
            session,
        });
        return res.json(clientes);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
})
module.exports = router;