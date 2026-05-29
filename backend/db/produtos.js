const COLLECTION = 'produtos';
const generateUuid = require('../utils/generate-uuid');
const { withStages } = require('../utils/query');

const notFoundMessage = 'Produto não encontrado';

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

        if (!produto) {
            throw new Error(notFoundMessage);
        }

        delete produto['@metadata'];
        return {
            data: produto,
        };
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
    }
}

const create = async ({
    session,
    nome,
    preco,
    imagem,
    categoria,
}) => {
    try {
        const newId = generateUuid(COLLECTION);
        const produto = {
            nome,
            preco,
            imagem,
            categoria,
            '@metadata': {
                '@collection': COLLECTION,
                '@id': newId,
            }
        };
        await session.store(produto, newId);

        await session.saveChanges();

        return findById({ session, id: newId.split('/')[1] });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }

}

const update = async ({
    session,
    id,
    nome,
    preco,
    imagem,
    categoria,
}) => {
    try {
        const produto = await session.load(`${COLLECTION}/${id}`);
        if (!produto) {
            throw new Error(notFoundMessage);
        }
        produto.nome = nome ?? produto.nome;
        produto.preco = preco ?? produto.preco;
        produto.imagem = imagem ?? produto.imagem;
        produto.categoria = categoria ?? produto.categoria;

        await session.saveChanges();
        return findById({ session, id: produto.id.split('/')[1] });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
}

const remove = async ({
    session,
    id,
}) => {
    try {
        const produto = await session.load(`${COLLECTION}/${id}`);
        if (!produto) {
            throw new Error(notFoundMessage);
        }
        session.delete(produto);
        await session.saveChanges();
        return { message: 'Produto removido com sucesso' };
    } catch (error) {
        console.error('Erro ao remover produto:', error);
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