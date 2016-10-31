'use strict'

app.controller('GroupEditCtrl', function ( $scope, $http, $location, $routeParams ) {

  $scope.submitEdit = () => {
    $http.put(`/api/groups/edit/${$routeParams.groupId}`, $scope.group)
      .then( group => $location.path(`/groups/:${$routeParams.groupId}`))
  }

  $http.get(`/api/groups/${$routeParams.groupId}`)
    .then( group => $scope.group = group.data)

})