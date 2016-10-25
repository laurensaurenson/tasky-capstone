'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('user', {

  "email" : { 
    type: String, 
    // unique: true 
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
  
  "interests" : { type: [ String ] },

  "achievedBadges" : { type: [ String ] },
  "groups" : { type: [ String ] },
  "friends" : { type: [ String ] },

})

// {
//   email: "lauren@lauren.com",
//   password: "1234",
//   userName: "Lauren",
//   birthDate: "10/03",
//   description: "Sick AF",
//   photo: "linkToPhoto.com",
//   interests: [ "wellness", "reading", "cooking" ]
// }

