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

// get groups and collections
router.get('/api/collections', (req, res, err) => {
  Users
    .findById(req.session.user._id)
    .then( user => {  
      Groups
        .find({ '_id' : { $in: user.groups } })
        .then( groups => res.status(200).json( groups ))
        .catch(err)
    })
    .catch(err)
})

// creates task collections not connected to social group
router.post('/api/collections', (req, res, err) => {
  Groups
    .create( req.body )
    .then( groupObj => {
      Users
        .findById( req.session.user._id )
        .then( user => {
          user.groups.push(groupObj._id)
          user.save()
          res.status(200).json( groupObj )
        })
        .catch(err)
    })
    .catch(err)
})

router.get('/api/collections/:collectionId', (req, res, err) => {
  Groups
    .findById(req.params.collectionId)
    .then( group => {
      Tasks
        .find({ 'groupId' : req.params.collectionId })
        .then( tasks => {
          res.status(200).json({ group, tasks })
        })
    })
    .catch(err)
})

module.exports = router