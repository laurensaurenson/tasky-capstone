'use strict'

const { Router } = require('express')
const router = Router()

const { json } = require('body-parser');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const Users = require('../models/user')
const Tasks = require('../models/task')
const Groups = require('../models/group')

const checkRepeatable = require('../controllers/taskRepeat')

router.use(session({
    store: new RedisStore({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    }),
    secret: 'supersecretkey'
}));

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

router.get('/api/tasks', (req, res, err) => {
  Tasks
    .find({'userId': req.session.user._id})
    .then(tasks => {
      tasks.map( task => {
        checkRepeatable( task )
      })
      res.json({tasks})
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

// get groups for group view
router.get('/api/groups', (req, res, err) => {
  console.log('get the groups')
  Groups
    // .find({ 'members' : { $contains: req.session.user._id } })
    .find({ 'members' : req.session.user._id })
    .then( groups => {
      const groupArray = []
      groups.forEach( group => {
        if ( group.groupType ) {
          groupArray.push(group)
        }
      })
      res.status(200).json( groupArray )
    })
    .catch(err)
})

// get groups and collections
router.get('/api/groups', (req, res, err) => {
  console.log('get the groups and collections')
  Groups
    // .find({ 'members' : { $contains: req.session.user._id } })
    .find({ '_id' : req.session.user.groups })
    .then( groups => {
      console.log('groups: ', groups)
      res.status(200).json( groups )
    })
    .catch(err)
})

// creates social groups
router.post('/api/groups', (req, res, err) => {
  const group = req.body
  group.admins = []
  group.members = []
  group.admins.push(req.session.user._id)
  group.members.push(req.session.user._id)
  group.groupType = true
  Groups
    .create( group )
    .then( groupObj => {
      Users
        .findById( req.session.user._id )
        .then( user => {
          console.log('user', user.groups)
          user.groups.push(groupObj._id)
          user.save()
          res.status(200).json(groupObj)
        })
        .catch(err)
    })
    .catch(err)
})

// get specific group for detail page
router.get('/api/groups/:groupId', (req, res, err) => {
  console.log('get the specific group')
  Groups
    .findById( req.params.groupId )
    .then( group => {
      console.log('group', group)
      res.status(200).json( group )
    })
    .catch(err)
})

// edits groups
router.put('/api/groups/edit/:groupId', (req, res, err) => {
  Groups
    .findOneAndUpdate( req.params.groupId, req.body, {upsert: true} )
    .then( group => {
      console.log('group editted', group)
      if ( checkArray( req.session.user._id, group.admins ) ) {
        res.status(200).json( group )
      } else {
        res.status(415).json( err )
      }
    })
    .catch(err)
})

// invite group member

// accept group invite

// reject group invite

// creates task collections not connected to social group
router.post('/api/collections', (req, res, err) => {
  const group = req.body
  Groups
    .create( group )
    .then( groupObj => {
      Users
        .find({ '_id' : req.session.user._id })
        .then( user => {
          user.groups.push(groupObj._id)
          user.save()
          res.status(200).json( groupObj )
        })
    })
})

router.post('/api/logout', (req, res, err) => {
  req.session.destroy()
})

const checkArray = ( friendId, userArray ) => {
  if ( userArray.indexOf(friendId) >= 0 ) {
    return true
  } else {
    return false
  }
}

module.exports = router



// add user to group
// // invite user to group
// // accept invite to group
// // reject invite to group

// get group info

// get group tasks

// get: {
//   route: "/tasks",
//   tasks // get user tasks
// }

// post: {
//   routes: "/addFriend/
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
