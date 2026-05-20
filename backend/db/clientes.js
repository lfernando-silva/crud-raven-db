const { withStages } = require('../utils/query');

const getClientes = async (req, { 
    qtd, 
    page,
    orderBy,
    projection
}) => {
    try {
        const session = req.ravenSession;
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

module.exports = {
    getClientes,
}