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


// get friend lists
router.get('/api/friends', (req, res, err) => {
  Users
    .findById(req.session.user._id)
    .then(user => {
      Users
        .find({ "_id": { $in: user.friends }})
        .then( friends => {
          Users
            .find({ "_id": { $in: user.friendsWaiting }})
            .then( friendsWaiting => {
              Users
                .find({ "_id": { $in: user.friendRequests }})
                .then( friendRequests => {
                  res.status(200).json( { friends, friendsWaiting, friendRequests } )
                })
                .catch(err)
            })
            .catch(err)
        })
        .catch(err)
    })
    .catch(err)
})

// make friend request
router.post('/api/friends', (req, res, err) => {
  const email = req.body.email
  Users
    .findOne({ email })
    .then( friend => {
      Users
        .findOne({ '_id' : req.session.user._id })
        .then( user => {
          if ( checkArray( friend._id, user.friends ) ) {
            res.status(423).json(err)
          } else {
            if ( checkArray( user._id, friend.friendRequests || checkArray( friend._id, user.friendsWaiting ) ) ) {
              res.status(432).json(err)
            } else {
              user.friendsWaiting.push(friend._id)
              friend.friendRequests.push(user._id)
              user.save()
              friend.save()
            }
          } 
        })
        .catch(err)
    })
    .catch(err)
})

// accept friend request
router.post('/api/friends/accept/:friendId', (req, res, err) => {
  Users
    .findById( req.params.friendId )
    .then( friend => {
      Users
        .findById( req.session.user._id ) 
        .then( user => {
          user.friends.push(friend._id)
          friend.friends.push(user._id)
          user.friendRequests.splice(user.friendRequests.indexOf(friend._id), 1)
          friend.friendsWaiting.splice(friend.friendsWaiting.indexOf(user._id), 1)
          user.save()
          friend.save()
          res.status(200)
        })
    })
})

// reject friend request
router.post('/api/friends/reject/:friendId', (req, res, err) => {
  Users
    .findById( req.params.friendId )
    .then( friend => {
      Users
        .findById( req.session.user._id ) 
        .then( user => {
          user.friendRequests.splice(user.friendRequests.indexOf(friend._id), 1)
          friend.friendsWaiting.splice(friend.friendsWaiting.indexOf(user._id), 1)
          user.save()
          friend.save()
          res.status(200)
        })
    })
})

module.exports = router