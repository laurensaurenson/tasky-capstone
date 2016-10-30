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

router.use(session({
    store: new RedisStore({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    }),
    secret: 'supersecretkey'
}))

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
  Groups
    .find({ 'members' : req.session.user._id })
    .then( groups => {
      Groups.find({ 'invitedMembers' : req.session.user._id })
      .then( invitedGroups => {
        res.status(200).json({ groups, invitedGroups })
      })
    })
    .catch(err)
})

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
  Groups
    .findById( req.params.groupId )
    .then( group => {
      res.status(200).json( group )
    })
    .catch(err)
})

// edits groups
router.put('/api/groups/edit/:groupId', (req, res, err) => {
  Groups
    .findOneAndUpdate( req.params.groupId, req.body, {upsert: true} )
    .then( group => {
      if ( checkArray( req.session.user._id, group.admins ) ) {
        res.status(200).json( group )
      } else {
        res.status(415).json( err )
      }
    })
    .catch(err)
})

// invite group member
router.post('/api/groups/invite/:groupId', (req, res, err) => {
  Groups
    .findById( req.params.groupId )
    .then( group => {
      Users
        .findOne({ 'email': req.body.email })
        .then( user => {
          if ( checkArray( user._id, group.invitedMembers ) || checkArray( group._id, user.groupInvites ) ) {
            res.status(413).json(err) // checks that invited user is not already invited to group
          } else if ( checkArray( user._id, group.members ) || checkArray( group._id, user.groups ) ) {
            res.status(412).json(err) // checks to see that invited user is not already a member
          } else if ( !checkArray( req.session.user._id, group.admins ) ) {
            res.status(414).json(err) // checks that user has permission to invite to group
          } else {
            user.groupInvites.push(group._id)
            group.invitedMembers.push(user._id)
            user.save()
            group.save()
            res.status(200).json( group )
          }
        })
        .catch(err)
    })
    .catch(err)
})

// accept group invite
router.post('/api/groups/accept/:groupId', (req, res, err) => {
  Groups
    .findById( req.params.groupId )
    .then( group => {
      Users
        .findById( req.session.user._id )
        .then( user => {
          if ( !checkArray( user._id, group.invitedMembers ) || !checkArray( group._id, user.groupInvites ) ) {
            res.status(412).json(err)
          } else {
            removeFromArray(user._id, group.invitedMembers)
            removeFromArray(group._id, user.groupInvites)
            user.groups.push(group._id)
            group.members.push(user._id)
            user.save()
            group.save()
            res.status(200).json(group)
          }
        })
        .catch(err)
    })
    .catch(err)
})

// reject group invite
router.post('/api/groups/reject/:groupId', (req, res, err) => {
  Groups
    .findById( req.params.groupId )
    .then( group => {
      Users
        .findById( req.session.user._id )
        .then( user => {
          if ( !checkArray( user._id, group.invitedMembers ) || !checkArray( group._id, user.groupInvites ) ) {
            res.status(412).json(err)
          } else {
            removeFromArray(user._id, group.invitedMembers)
            removeFromArray(group._id, user.groupInvites)
            user.save()
            group.save()
            res.status(200).json(group)
          }
        })
        .catch(err)
    })
    .catch(err)
})

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

const removeFromArray = ( value, array ) => array.splice( value, 1 )

const checkArray = ( friendId, userArray ) => {
  if ( userArray.indexOf(friendId) >= 0 ) {
    return true
  } else {
    return false
  }
}

module.exports = router

// get user social-groups/collections for task page
// // additionally needs to include + custom
// be able to create custom collection for tasks
// // create view to choose suggested groups / tasks

// get group tasks

// score points
// // level up logic
// // level point #s

// ( difficulty * repeatableTime ) * 10
// // ( 1 * 1 ) * 10 = 10 ( easy daily )
// // ( 2 * 3 ) * 10 = 60 ( medium monthly)

// badge tracking
// // track points
// // track group specifc user points
// // badges associated with pre-determined task groups
// // badges associated with 'custom' task groups
// // badges associated with social groups

// // *** aesthetic *** // //

// create task icons 
// // assignable with tasks
// // chosen with creation
// // fetch into sortable select feature
// // topically grouped vs view all
