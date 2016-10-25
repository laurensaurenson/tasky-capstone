'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('task', {
  "userId": { type: String },

  "taskName" : { type: String }, 
  "icon" : { type: { 
      "iconDesc" : { type: String },
      "iconLink" : { type: String }
    }}, 
  "repeatableTime" : { type: Number }, // string or number? 
      // where to put this logic ? ? 
  "type" : { type: String }, 
  "importance" : { type: String }, 
  "difficulty" : { type: Number }, 
  "notifications" : { type: Boolean }, 
  "notes" : { type: String }, 
  "suggested" : { 
    type: Boolean,
    default: false
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