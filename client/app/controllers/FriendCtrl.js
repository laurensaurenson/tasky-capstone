'use strict'

app.controller('FriendCtrl', function ( $scope, $http, $location ) {

  $scope.goToAddFriend = () => {
    $location.path('/friends/add')
  }

  $scope.addFriend = () => {
    const newFriend = {
      email : $scope.email
    }
    $http.post('/api/friends', newFriend)
  }

  $scope.acceptFriend = ( friendId ) => {
    $http.post(`/api/friends/accept/${friendId}`)
      .then( data => {
        getFriends()
      })
  }

  $scope.rejectFriend = ( friendId ) => {
    $http.post(`/api/friends/reject/${friendId}`)
      .then( data => {
        getFriends()
      })
  }

  const getFriends = () => {
    $http.get('/api/friends')
      .then(({ data: { friends, friendsWaiting, friendRequests } }) => {
        $scope.friends = friends
        $scope.friendsWaiting = friendsWaiting
        $scope.friendRequests = friendRequests
        console.log('friends:  ', friends)
        console.log('friendsWaiting:  ', friendsWaiting)
        console.log('friendRequests:  ', friendRequests)
      })
  }

  getFriends()


})