'use strict'

app.controller('ProfileCtrl', function ( $scope, $http, $location ) {

  console.log('user profile')

  $http.get('/api/user')
    .then( user => {
      $scope.user = user.data
      console.log('user: ', $scope.user)
    })

})