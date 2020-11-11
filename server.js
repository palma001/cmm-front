// This file allows Heroku to start the application with the command "node server.js".
const express = require('express')
const path = require('path')
const app = express()

const port = process.env.PORT || 5000

app.use('/', express.static(path.join(__dirname, '/dist/pwa')))
app.listen(port)

console.log('Server started on port ' + port + '.')
