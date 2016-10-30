'use strict'

app.controller('GroupViewCtrl', function ( $scope, $http, $location, $routeParams ) {

  $scope.goToGroupEdit = () => $location.path(`/groups/edit/${$routeParams.groupId}`)

  $scope.inviteMember = () => {
    $http.post(`/api/groups/invite/${$routeParams.groupId}`, { email: $scope.email })
      .then( group => $scope.email = '')
  }

  $http.get(`/api/groups/${$routeParams.groupId}`)
    .then( group => {
      $scope.group = group.data.group
      $scope.tasks = group.data.tasks
    })

})