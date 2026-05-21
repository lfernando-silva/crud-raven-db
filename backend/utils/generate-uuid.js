const { randomUUID } = require('node:crypto');

module.exports = (collection) => {
    return `${collection}/${randomUUID()}`;
}