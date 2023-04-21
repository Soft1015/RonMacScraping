const express = require('express')
const bodyParser = require('body-parser')
const { init } = require('./db')
const { getData } = require('./scraping/ober-haus')

const routes = require('./routes')

const app = express()
app.use(bodyParser.json())
app.use(routes)

init().then(() => {
    console.log('starting server on port 3000')
    getData();
    app.listen(3000)
})
