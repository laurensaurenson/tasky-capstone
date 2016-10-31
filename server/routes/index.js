'use strict'

const { Router } = require('express')
const router = Router()

const session = require('express-session')
const RedisStore = require('connect-redis')(session)

router.use(session({
    store: new RedisStore({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    }),
    secret: 'supersecretkey'
}))

router.use(require('./user'))
router.use(require('./friends'))
router.use(require('./groups'))
router.use(require('./tasks'))
router.use(require('./collections'))

module.exports = router

// level up logic
// level point #s

// badge tracking
// // track points
// // track group specifc user points
// // badges associated with pre-determined task groups
// // badges associated with 'custom' task groups
// // badges associated with social groups

// // *** aesthetic or extra UX *** // //

// // create view to choose suggested groups / tasks

// create task icons 
// // assignable with tasks
// // chosen with creation
// // fetch into sortable select feature
// // topically grouped vs view all