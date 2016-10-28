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
  "type" : { type: String }, 
  "importance" : { type: String }, 
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


// {
//   taskName: Read the book,
//   icon: {
//     iconDesc: open book,
//     iconLink: bookimage.com
//   },
//   repeatable: true,
//   repeatableTime: weekly,
//   type: Reading,
//   importance: "kinda",
//   difficulty: "low", // OR 3, // out of 10  ?
//   notifications: true,
//   notes: "read the assigned book"
// }

// taskGroups: 
//   exercise,
//   study,
//   cooking,