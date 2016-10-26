'use strict'

const mongoose = require('mongoose')

const MONGOD_URL = process.env.MONGOD_URL || "mongodb://localhost:27017/backcapstone"

mongoose.Promise = Promise

module.exports.connect = () => mongoose.connect(MONGOD_URL)