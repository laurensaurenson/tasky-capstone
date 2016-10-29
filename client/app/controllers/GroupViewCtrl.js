'use strict'

app.controller('GroupViewCtrl', function ( $scope, $http, $location, $routeParams ) {

  $scope.goToGroupEdit = id => {
    $location.path(`/groups/edit/${id}`)
  }

  $http.get(`/api/groups/${$routeParams.groupId}`)
    .then( group => {
      console.log('this group: ', group)
      $scope.group = group.data
    })

})