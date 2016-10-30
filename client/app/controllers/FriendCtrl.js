'use strict'

app.controller('FriendCtrl', function ( $scope, $http, $location, $route ) {

  $scope.goToAddFriend = () => {
    $location.path('/friends/add')
  }

  $scope.addFriend = () => {
    $http.post('/api/friends', $scope.newFriend)
      .then( friend => $location.path('/friends'))
  }

  $scope.acceptFriend = ( friendId ) => {
    $http.post(`/api/friends/accept/${friendId}`)
      .then( data => {
        $route.refresh()
      })
  }

  $scope.rejectFriend = ( friendId ) => {
    $http.post(`/api/friends/reject/${friendId}`)
      .then( data => {
        $route.refresh()
      })
  }

  $http.get('/api/friends')
    .then(({ data: { friends, friendsWaiting, friendRequests } }) => {
      $scope.friends = friends
      $scope.friendsWaiting = friendsWaiting
      $scope.friendRequests = friendRequests
    })

})