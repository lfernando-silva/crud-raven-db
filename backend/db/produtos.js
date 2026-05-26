const COLLECTION = 'produtos';
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

        const produtos = await query
            .skip((page - 1) * qtd)
            .take(qtd)
            .statistics(s => stats = s)
            .all();

        return {
            data: produtos,
            pagination: {
                page,
                qtd,
            },
            total: stats.totalResults,
        };
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
}

const findById = async ({
    session,
    id,
}) => {
    try {
        const [produto] = await session.query({ collection: COLLECTION })
            .whereEquals("id()", `${COLLECTION}/${id}`)
            .all();

        delete produto['@metadata'];
        return {
            data: produto,
        };
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
    }
}

module.exports = {
    find,
    findById,
}