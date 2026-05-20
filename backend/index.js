const express = require('express')

// custom middlewares
const {
    ravenDbSession,
    parseQueryParams
} = require('./middlewares');

const apiRouter = require('./routers');

const app = express()
const port = process.env.NODE_PORT || 3000

app.get('/', (req, res) => {
  return res.json({ timestamp: new Date().toISOString() })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(ravenDbSession);
app.use(parseQueryParams);

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`CRUD RAVEN DB EXECUTANDO EM ${port}`)
})