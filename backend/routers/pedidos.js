const express = require('express')
const router = express.Router()
const pedidosDB = require('../db/pedidos');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');
const { pedidoValidators: validator } = require('../middlewares/validators');

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

router.get('/search', async (req, res) => {
    const session = req.ravenSession;
    const { nome } = req.query;
    try {
        const pedidos = await pedidosDB.search({
            clienteNome: nome,
            session,
        });
        return res.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

router.get('/total/:clienteId', async (req, res) => {
    const session = req.ravenSession;
    const { clienteId } = req.params;
    try {
        const total = await pedidosDB.totalByClienteId({
            clienteId,
            session,
        });
        return res.json({ total });
    } catch (error) {
        console.error('Erro ao calcular total de pedidos:', error);
        return res.status(500).json({ error: 'Erro ao calcular total de pedidos' });
    }
});

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

router.post('/', validator, async (req, res) => {
    const session = req.ravenSession;
    const {
        clienteId,
        itens,
        totalPedido,
    } = req.body;
    try {
        const pedido = await pedidosDB.create({
            session,
            clienteId,
            itens,
            totalPedido,
        });
        return res.status(201).json(pedido);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

router.put('/:id', validator, async (req, res) => {
    const session = req.ravenSession;
    const { id } = req.params;
    const {
        clienteId,
        itens,
        totalPedido,
    } = req.body;
    try {
        const pedido = await pedidosDB.update({
            session,
            id,
            clienteId,
            itens,
            totalPedido,
        });
        return res.json(pedido);
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
});

router.delete('/:id', async (req, res) => {
    const session = req.ravenSession;
    const { id } = req.params;
    try {
        await pedidosDB.remove({
            session,
            id,
        });
        return res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        return res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
});

module.exports = router;