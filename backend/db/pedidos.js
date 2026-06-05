const COLLECTION = 'pedidos';
const generateUuid = require('../utils/generate-uuid');
const { withStages } = require('../utils/query');
const clientesDB = require('./clientes');
const produtosDB = require('./produtos');
const notFoundMessage = 'Pedido não encontrado';

const joinQueryString = ({ page, orderBy, condition = '', qtd }) => {
    return `
            from ${COLLECTION} as p
            ${orderBy ? `order by ${orderBy.map(o => `p.${o[0]} ${o[1]}`).join(', ')}` : ''}
            ${condition}
            select {
                id: id(p),
                clienteId: p.clienteId,
                clienteNome: load(p.clienteId).nome,
                criadoEm: p.criadoEm,
                totalPedido: p.totalPedido,
                itens: p.itens.map(i => ({
                    produtoId: i.produtoId,
                    produtoNome: load(i.produtoId).nome,
                    produtoImagem: load(i.produtoId).imagem,
                    produtoCategoria: load(i.produtoId).categoria,
                    quantidade: i.quantidade,
                    precoUnitario: i.precoUnitario
                }))
            }
            include p.clienteId, p.itens[].produtoId
            limit ${(page - 1) * qtd}, ${qtd}
        `.trim().replaceAll("\n", "");
}

const find = async ({
    session,
    qtd,
    page,
    orderBy
}) => {
    try {
        let stats;
        const queryString = joinQueryString({
            orderBy,
            page,
            qtd,
        });
        const pedidos = await session.advanced
            .rawQuery(queryString)
            .statistics(s => stats = s)
            .all();

        return {
            data: pedidos,
            pagination: {
                page,
                qtd,
            },
            total: stats.totalResults,
        };
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
}

const findById = async ({
    session,
    id,
}) => {
    try {
        const queryString = joinQueryString({ page: 1, condition: `where id() = "${COLLECTION}/${id}"`, qtd: 1 });
        const [pedido] = await session.advanced
            .rawQuery(queryString)
            .all();

        if (!pedido) {
            throw new Error('Pedido não encontrado');
        }

        delete pedido['@metadata'];
        return {
            data: pedido,
        };
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        throw error;
    }
}

const search = async ({
    session,
    clienteNome,
}) => {
    try {
        let stats;

        const queryString = `
            from index "Pedidos/ByClienteNome" as p
            where startsWith(clienteNomeLower, "${clienteNome.toLowerCase()}")
            order by clienteNomeLower asc
            load p.clienteId as cliente
            select {
                id: id(p),
                clienteId: p.clienteId,
                clienteNome: cliente.nome,
                totalPedido: p.totalPedido,
                criadoEm: p.criadoEm
            }
            limit 0, 50
        `.trim().replaceAll("\n", "");

        const pedidos = await session.advanced
            .rawQuery(queryString)
            .statistics(s => stats = s)
            .all();

        return {
            data: pedidos,
            total: stats.totalResults,
        };
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
}

const create = async ({
    session,
    clienteId,
    itens,
    totalPedido,
}) => {
    try {
        const id = generateUuid();
        const criadoEm = new Date().toISOString();

        // validar se cliente existe
        const cliente = await clientesDB.findById({
            session,
            id: clienteId,
        });

        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }

        // validar se produtos existem
        for (const item of itens) {
            const produto = await produtosDB.findById({
                session,
                id: item.produtoId,
            });

            if (!produto) {
                throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
            }
        }
        const newId = generateUuid(COLLECTION);
        const pedido = {
            '@metadata': {
                '@collection': COLLECTION,
                '@id': newId,
            },
            clienteId: `clientes/${clienteId}`,
            itens: itens.map(e => {
                e.produtoId = `produtos/${e.produtoId}`;
                return e;
            }),
            totalPedido,
            criadoEm,
        }

        await session.store(pedido, newId);

        await session.saveChanges();

        return findById({ session, id: newId.split('/')[1] });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}

const update = async ({
    session,
    id,
    clienteId,
    itens,
    totalPedido,
}) => {
    try {
        const pedido = await session.load(`${COLLECTION}/${id}`);
        if (!pedido) {
            throw new Error(notFoundMessage);
        }

        // validar se cliente existe
        await clientesDB.findById({
            session,
            id: clienteId.split('/')[1],
        });

        // validar se produtos existem
        for (const item of itens) {
            await produtosDB.findById({
                session,
                id: item.produtoId.split('/')[1],
            });
        }

        pedido.clienteId = clienteId;
        pedido.itens = itens;
        pedido.totalPedido = totalPedido;

        await session.saveChanges();
        return findById({ session, id });
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        throw error;
    }
}

const remove = async ({
    session,
    id,
}) => {
    try {
        const pedido = await session.load(`${COLLECTION}/${id}`);
        if (!pedido) {
            throw new Error(notFoundMessage);
        }
        session.delete(pedido);
        await session.saveChanges();
        return { message: 'Pedido removido com sucesso' };
    } catch (error) {
        console.error('Erro ao remover pedido:', error);
        throw error;
    }
}

module.exports = {
    find,
    findById,
    search,
    create,
    update,
    remove,
}