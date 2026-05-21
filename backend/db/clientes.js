const COLLECTION = 'clientes';
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
        const [cliente] = await session.query({ collection: COLLECTION })
            .whereEquals("id()", `${COLLECTION}/${id}`)
            .all();

        delete cliente['@metadata'];
        return {
            data: cliente,
        };
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
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
        const newId = generateUuid(COLLECTION);
        const cliente = {
            nome,
            endereco,
            email,
            telefone,
            instagram,
            '@metadata': {
                '@collection': COLLECTION,
                '@id': newId,
            }
        };
        await session.store(cliente, newId);

        await session.saveChanges();

        return findById({ session, id: newId.split('/')[1] });
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
        const cliente = await session.load(`${COLLECTION}/${id}`);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        cliente.nome = nome ?? cliente.nome;
        cliente.endereco = endereco ?? cliente.endereco;
        cliente.email = email ?? cliente.email;
        cliente.telefone = telefone ?? cliente.telefone;
        cliente.instagram = instagram ?? cliente.instagram;

        await session.saveChanges();
        return findById({ session, id: cliente.id.split('/')[1] });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
}

const remove = async ({
    session,
    id,
}) => {
    try {
        const cliente = await session.load(`${COLLECTION}/${id}`);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        session.delete(cliente);
        await session.saveChanges();
        return { message: 'Cliente removido com sucesso' };
    } catch (error) {
        console.error('Erro ao remover cliente:', error);
        throw error;
    }
}

module.exports = {
    find,
    findById,
    create,
    update,
    remove,
}