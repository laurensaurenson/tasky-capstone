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

router.get('/api/tasks', (req, res, err) => {
  Tasks
    .find({'userId': req.session.user._id})
    .then(tasks => {
      const completeTasks = []
      const incompleteTasks = []
      tasks.map( task => {
        checkRepeatable( task )
        if( task.completed ) {
          completeTasks.push( task )
        } else {
          incompleteTasks.push( task )
        }
      })
      res.json({ completeTasks, incompleteTasks })
    })
    .catch(err)
})

router.post('/api/tasks', (req, res, err) => {
  const task = req.body
  task.userId = req.session.user._id
  
  Tasks
    .create(task)
    .then( task => res.status(201).json(task))
    .catch(err)
})

router.get('/api/tasks/:taskId', (req, res, err) => {
  Tasks
    .findById(req.params.taskId)
    .then( task => {
      res.status(200).json(task)
    })
    .catch(err)
})

router.put('/api/tasks/edit/:taskId', (req, res, err) => {
  Tasks
    .findByIdAndUpdate(req.params.taskId, req.body)
    .then( task => {
      res.status(200).json(task)
    })
})

router.put('/api/tasks/complete/:taskId', (req, res, err) => {
  Tasks
    .findById(req.params.taskId)
    .then( task => {
      task.completed = true
      task.save()
      res.status(200).json(task)
    })
    .catch(err)
})

router.post('/api/tasks/delete/:taskId', (req, res, err) => {
  Tasks
    .findByIdAndRemove(req.params.taskId)
    .then( task => {
      res.status(200).json(task)
    })
    .catch(err)
})

module.exports = router