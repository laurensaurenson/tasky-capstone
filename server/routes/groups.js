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

module.exports = router

