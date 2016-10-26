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

})