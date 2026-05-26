const express = require('express')
const router = express.Router()
const produtosDB = require('../db/produtos');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');

router.get('/', async (req, res) => {
    const session = req.ravenSession;
    try {
        const produtos = await produtosDB.find({
            ...req.routerQuery,
            session,
        });
        return res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const session = req.ravenSession;
    try {
        const produtos = await produtosDB.findById({
            id,
            session,
        });
        return res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
})

module.exports = router;