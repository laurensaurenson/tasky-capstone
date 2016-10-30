'use strict'

const mongoose = require('mongoose')

const getDay = () => {
  let now = new Date()
  let start = new Date(now.getFullYear(), 0, 0)
  let diff = now - start
  let oneDay = 1000 * 60 * 60 * 24
  let day = Math.floor(diff / oneDay)
  return day
}

const getMonth = () => {
  let now = new Date()
  return now.getMonth()
}

module.exports = mongoose.model('task', {
  "userId": { type: String },
  "username": { type: String },

  "taskName" : { type: String }, 
  "icon" : { type: { 
      "iconDesc" : { type: String },
      "iconLink" : { type: String }
    }}, 

  "repeatableTime" : { type: Number }, 
  "dayRef" : { 
    type: Number,
    default: getDay() 
  },
  "monthRef" : {
    type: Number, 
    default: getMonth()
  },

  // "type" : { type: String }, 
  "importance" : { 
    type: Number,
    default: 1 
  }, 
  "difficulty" : { type: Number }, 
  "notifications" : { type: Boolean }, 
  "notes" : { type: String }, 
  "suggested" : { 
    type: Boolean,
    default: false
  },
  "completed" : {
    type : Boolean,
    default : false 
  },
  "groupId" : {
    type: String
  } 

})