const parseOrderBy = (orderBy) => {
    if (!orderBy) return [['id', 'asc']];

    return orderBy.split(',').map(item => {
        const [field, direction] = item.split(':');
        return [field, direction || 'asc'];
    });
}

const parseProjection = (projection) => {
    if (!projection) return undefined;
    return projection.split(',').map(item => item.trim());
}

module.exports = (req, res, next) => {
    const {
        qtd = 10,
        page = 1,
        orderBy = 'id:asc',
        projection = []
    } = req.query;

    req.routerQuery = {
        ...req.query, 
        qtd: parseInt(qtd, 10), 
        page: parseInt(page, 10), 
        orderBy: parseOrderBy(orderBy), 
        projection: parseProjection(projection)
    };

    return next();
}