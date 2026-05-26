const express = require('express')
const router = express.Router()
const produtosDB = require('../db/produtos');
const { parseOrderBy, parseProjection } = require('../middlewares/router-query');
const { produtoValidators: validator } = require('../middlewares/validators');

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

router.post('/', validator, async (req, res) => {
    const session = req.ravenSession;
    const {
        nome,
        preco,
        imagem,
    } = req.body;
    try {
        const produto = await produtosDB.create({
            nome,
            preco,
            imagem,
            session,
        });
        return res.json(produto);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        return res.status(500).json({ error: 'Erro ao criar produto' });
    }
})

router.put('/:id', validator, async (req, res) => {
    const session = req.ravenSession;
    const { id } = req.params;
    const {
        nome,
        preco,
        imagem,
    } = req.body;
    try {
        const produto = await produtosDB.update({
            id,
            nome,
            preco,
            imagem,
            session,
        });
        return res.json(produto);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
})

router.delete('/:id', async (req, res) => {
    const session = req.ravenSession;
    const { id } = req.params;
    try {
        await produtosDB.remove({
            id,
            session,
        });
        return res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        return res.status(500).json({ error: 'Erro ao remover produto' });
    }
})

module.exports = router;