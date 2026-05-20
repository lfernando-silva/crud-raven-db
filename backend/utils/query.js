const bindOrderBy = (orderBy, currentQuery) => {
    if (!orderBy || !Array.isArray(orderBy)) return currentQuery;

    orderBy.forEach(([field, direction], index) => {
        //if (index === 0) {
            if (direction === 'asc') {
                currentQuery = currentQuery.orderBy(field);
            } else {
                currentQuery = currentQuery.orderByDescending(field);
            }
        // } else {
        //     if (direction === 'asc') {
        //         currentQuery = currentQuery.thenBy(field);
        //     } else {
        //         currentQuery = currentQuery.thenByDescending(field);
        //     }
        // }
    });
    return currentQuery;
}

const bindProjection = (projection, currentQuery) => {
    if (!projection || !Array.isArray(projection)) return currentQuery;
    return currentQuery.selectFields(projection);
}

const withStages = (stages, currentQuery) => {
    Object.keys(stages).forEach(stage => {
        if (stage === 'orderBy') {
            currentQuery = bindOrderBy(stages[stage], currentQuery);
        }
        if (stage === 'projection' && stages[stage]?.length > 0) {
            currentQuery = bindProjection(stages[stage], currentQuery);
        }
    });
    return currentQuery;
}

module.exports = {
    withStages,
}