const { store } = require('../db/store');

// middleware para abrir e fechar sessão do RavenDB para cada requisição
module.exports = (req, res, next) => {
    req.ravenSession = store.openSession();
    res.on('finish', () => {
        if (req.ravenSession) {
            req.ravenSession.dispose();
        }
    });
    next();
};