'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('group', {
  'name': {
    type: String
  },
  'admins': {
    type: [ String ]
  },
  'description': {
    type: String
  },
  'members': {
    type: [ String ]
  },
  'groupType': {
    type: Boolean,
    default: false
  }

})