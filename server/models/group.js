'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('group', {
  'name': { type: String },
  'description': { type: String },
  
  'admins': { type: [ String ]},
  'members': { type: [ String ]},
  'invitedMembers': { type: [ String ]},

  // 'groupType': {
  //   type: Boolean,
  //   default: false
  // }

})