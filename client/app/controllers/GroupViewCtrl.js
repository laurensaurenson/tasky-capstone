'use strict'

app.controller('GroupViewCtrl', function ( $scope, $http, $location, $routeParams ) {

  $scope.goToGroupEdit = id => {
    $location.path(`/groups/edit/${id}`)
  }

  $scope.inviteMember = () => {
    console.log('invite member', $scope.email)
    $http.post(`/api/groups/invite/${$routeParams.groupId}`, { email: $scope.email })
      .then( group => {
        console.log('group: ', group)
      })
  }

  $http.get(`/api/groups/${$routeParams.groupId}`)
    .then( group => {
      console.log('this group: ', group)
      $scope.group = group.data
    })

})