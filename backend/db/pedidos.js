const COLLECTION = 'pedidos';
const generateUuid = require('../utils/generate-uuid');
const { withStages } = require('../utils/query');

const find = async ({
    session,
    qtd,
    page,
    orderBy,
    projection
}) => {
    try {
        let stats;

        const query = withStages({
            orderBy, projection
        }, session.query({
            collection: COLLECTION
        }));

        const pedidos = await query
            .skip((page - 1) * qtd)
            .take(qtd)
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
        const [pedido] = await session.query({ collection: COLLECTION })
            .whereEquals("id()", `${COLLECTION}/${id}`)
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

module.exports = {
    find,
    findById,
}