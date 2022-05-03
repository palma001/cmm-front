// This file allows Heroku to start t
const express = require('express')
var cors = require('cors')
const path = require('path')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.listen(port)

// Routes
app.use('/api/plaid', require('./server/routes/plaid'))

app.use(express.static(path.join(__dirname, '/dist/pwa')))

console.log('Server started on port ' + port + '.')
