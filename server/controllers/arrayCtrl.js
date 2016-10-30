module.exports.removeFromArray = ( value, array ) => array.splice( value, 1 )

module.exports.checkArray = ( friendId, userArray ) => {
  if ( userArray.indexOf(friendId) >= 0 ) {
    return true
  } else {
    return false
  }
}