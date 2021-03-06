'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('user', {

  "username": { type: String },
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

  // "badges": {
  //   type: {
  //     "daily10"
  //   },
  // }

  "ranking" : { type: String },
  "points" : { 
    type: Number,
    default: 0 
  },
  "achievedBadges" : { type: [ String ] },
  
  "interests" : { type: [ String ] },

  "groups" : { type: [ String ] },
  "groupInvites" : { type: [ String ]},

  "friends" : { type: [ String ] },
  "friendsWaiting" : { type: [ String ] },
  "friendRequests" : { type: [ String ] }

})