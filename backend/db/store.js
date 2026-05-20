const { DocumentStore } = require('ravendb');
const { DB_URL: dbUrl, DB_NAME: dbName } = process.env;

if (!dbUrl || !dbName) {
    console.error('Defina DB_URL e DB_NAME no arquivo .env');
    process.exit(1);
}

const store = new DocumentStore(dbUrl, dbName);
store.initialize();

module.exports = { store };