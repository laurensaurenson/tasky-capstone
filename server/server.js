'use strict'

// third party requires 
const express = require('express')
const { json } = require('body-parser')

const routes = require("./routes/")
const { connect } = require('./database')

const app = express()

const port = process.env.PORT || 3210;

app.set("port", port)

app.use(express.static('client'))
app.use(json())

// routes
app.use(routes)

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on Port number ${port}`)
    })
  })
  .catch(console.error)
