'use strict'

const { Router } = require('express')
const router = Router()

const { json } = require('body-parser')

const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const Users = require('../models/user')
const Tasks = require('../models/task')
const Groups = require('../models/group')

const checkRepeatable = require('../controllers/taskRepeat')
const { checkArray, removeFromArray } = require('../controllers/arrayCtrl')

router.get('/api/user', (req, res, err ) => {
  Users
    .findById(req.session.user._id)
    .then(user => res.status(201).json(user.profileInfo))
})

router.post('/api/register', (req, res, err) => {
  Users
    .create( req.body )
    .then( user => res.status(201).json(user))
    .catch(err)
})

router.put('/api/register/:userId', (req, res, err) => {
  Users
    .findOneAndUpdate({"_id": req.params.userId}, req.body, {upsert: true})
    .then( user => res.status(201).json(user) )
    .catch(err)
})

router.post('/api/login', (req, res, err) => {
  const email = req.body.email
  const password = req.body.password
  Users
    .findOne({ email })
    .then( user => {
      if(user && user.password === password) {
        req.session.user = user
        res.status(200).json(req.session.user)
      } else {
        res.status(400).json(err)
      }
    })
    .catch(err)
})

router.post('/api/logout', (req, res, err) => {
  req.session.destroy()
})

module.exports = router