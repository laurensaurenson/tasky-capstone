'use strict'

const checkRepeatable = ( task ) => {
  if ( task.repeatableTime === 1 && checkDay( task.dayRef )) {
    resetTask( task )
  } else if ( task.repeatableTime === 2  && checkWeek( task.dayRef )) {
    resetTask( task )
  } else if ( task.repeatableTime === 3 && checkMonth( task.monthRef )) {
    resetTask( task )
  }
  return
}

const resetTask = ( task ) => {
  task.dayRef = getDay()
  task.monthRef = getMonth()
  task.completed = false
  task.save()
}

const checkDay = ( day ) => {
  if ( day === getDay() ) {
    return false
  } else {
    return true
  }
}

const checkWeek = ( day ) => {
  if ( getWeek(day) === getWeek(getDay()) ) {
    return false
  } else {
    return true
  }
}

const checkMonth = ( month ) => {
  if ( month === getMonth() ) {
    return false
  } else {
    return true
  }
}

const getDay = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)
  return day
}

const getWeek = ( day ) => {
  const thisDate = new Date()
  const thisYear = thisDate.getFullYear()
  const firstDate = new Date(`January 1 ${thisYear}`)
  const firstWeekDay = firstDate.getDay()
  const week = Math.floor( ( day + firstWeekDay ) / 7 )
  return week
}

const getMonth = () => {
  let now = new Date()
  return now.getMonth()
}

module.exports = checkRepeatable