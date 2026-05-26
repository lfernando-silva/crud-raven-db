const express = require('express')
const router = express.Router()
const clientesDB = require('../db/clientes');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');
const { clienteValidators: validator } = require('../middlewares/validators');

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
        console.error('Erro ao buscar cliente:', error);
        return res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
})

router.post('/', validator, async (req, res) => {
    const session = req.ravenSession;
    const {
        nome,
        endereco,
        email,
        telefone,
        instagram,
    } = req.body;
    try {
        const cliente = await clientesDB.create({
            nome,
            endereco,
            email,
            telefone,
            instagram,
            session,
        });
        return res.json(cliente);
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
})

router.put('/:id', validator, async (req, res) => {
    const session = req.ravenSession;
    const { id } = req.params;
    const {
        nome,
        endereco,
        email,
        telefone,
        instagram,
    } = req.body;
    try {
        const cliente = await clientesDB.update({
            id,
            nome,
            endereco,
            email,
            telefone,
            instagram,
            session,
        });
        return res.json(cliente);
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
})

router.delete('/:id', async (req, res) => {
    const session = req.ravenSession;
    const { id } = req.params;
    try {
        await clientesDB.remove({
            id,
            session,
        });
        return res.json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover cliente:', error);
        return res.status(500).json({ error: 'Erro ao remover cliente' });
    }
})

module.exports = router;