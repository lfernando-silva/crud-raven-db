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

        const query = withStages({ orderBy, projection }, session.query({ collection: 'clientes' }));
        
        const clientes = await query
            .skip((page - 1) * qtd)
            .take(qtd)
            .statistics(s => stats = s)
            .all();

        return {
            data: clientes,
            pagination: {
                page,
                qtd,
            },
            total: stats.totalResults,
        };
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }
}

const findById = async ({
    session,
    id,
}) => {
    try {       
        const [cliente] = await session.query({ collection: 'clientes' })
            .whereEquals("id()", `clientes/${id}`)
            .all();

        return {
            data: cliente,
        };
    } catch (error) {
        console.error('Erro ao buscar clientee:', error);
        throw error;
    }
}

module.exports = {
    find,
    findById,
}