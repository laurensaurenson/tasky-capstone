'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('user', {

  "email" : { 
    type: String, 
    unique: true 
  },
  "password" : { type: String },
  "profileInfo" : { 
    type: {
      "userName" : { type: String },
      "birthDate" : { type: String },
      "description" : { type: String },
      "photo" : { type: String },
    }
  },

  "ranking" : { type: String },
  "points" : { type: String },
  "achievedBadges" : { type: [ String ] },
  
  "interests" : { type: [ String ] },

  "groups" : { type: [ String ] },
  "groupInvites" : { type: [ String ]},

  "friends" : { type: [ String ] },
  "friendsWaiting" : { type: [ String ] },
  "friendRequests" : { type: [ String ] }

})