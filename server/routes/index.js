'use strict'

const { Router } = require('express')
const router = Router()

const { json } = require('body-parser');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const Users = require('../models/user')
const Tasks = require('../models/task')

router.use(session({
    store: new RedisStore({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    }),
    secret: 'supersecretkey'
}));

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

router.get('/api/tasks', (req, res, err) => {
  Tasks
    .find()
    .then(tasks => res.json({tasks}))
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

router.get('/api/friends', (req, res, err) => {

})

router.post('/api/friends', (req, res, err) => {
  const email = req.body.email
  Users
    .findOne({ email })
    .then( friend => {
      Users
        .findOneAndUpdate({ '_id' : req.session.user._id })
        .then( user => {
          user.friends.push(user._id)
        })
    })
})

router.post('/api/groups', (req, res, err) => {

})

router.post('/api/groups', (req, res, err) => {

})

router.post('/api/logout', (req, res, err) => {
  req.session.destroy()
})

module.exports = router

// get: {
//   route: "/login",
//   users
//   // saving user with redis
// }

// post: {
//   route: "/register",
//   users // password and email checking and posting
// }

// post: {
//   route: "/register/:userId",
//   users // adding other user info 
// }

// post: {
//   route: "/createTask",
//   tasks 
// }

// get: {
//   route: "/tasks",
//   tasks // get user tasks
// }

// post: {
//   routes: "/addFriend/:userId1/:userId2",
//   users // 
// }

// post: {
//   route: "/completeTask/:taskId",
//   tasks
// }

// get: {
//   routes: "/logout",
//   destroy // destroy redis session
// }

// // // 

// GIVEN _ WHEN _ THEN _

// As a user, I want to be able to login to personal profile.

// As a user, I want to be able to create tasks.

// As a user, I want to be able to view my personal tasks.

// As a user, I want to be able to add friends.

// As a user, I want to be able to join groups with friends.

// As a friend, I want my profile to be viewable by friends.

// As a group member, I want to be able to mark tasks as visible to group.

// As a group member, I want to be able to view other group member's associated tasks.

// As a group member, I want some form of group communication or interaction.

// As a user, I want to be able to mark tasks as completeTask.

// As a user, I want to be able to have tasks repeatable on certain time frames.

// As a user, I want to be able to gain points based on completed tasks.

// As a user, I want to be able to earn badges based on tasks completed.

// As a user, I want to be able to level up based on earned points.
