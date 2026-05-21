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

const create = async ({
    session,
    nome,
    endereco,
    email,
    telefone,
    instagram,
}) => {
    try {
        const cliente = {
            nome,
            endereco,
            email,
            telefone,
            instagram,
        };
        delete cliente.id
        await session.store(cliente, 'clientes|');

        await session.saveChanges();

        return findById({ session, id: cliente.id.split('/')[1] });
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }

}

const update = async ({
    session,
    id,
    nome,
    endereco,
    email,
    telefone,
    instagram,
}) => {
    try {
        const cliente = {
            nome,
            endereco,
            email,
            telefone,
            instagram,
            "@metadata": {
                "@collection": "clientes"
            }
        };

        await session.saveChanges();
        return findById({ session, id: cliente.id });
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }

}

module.exports = {
    find,
    findById,
    create,
}