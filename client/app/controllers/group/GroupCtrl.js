'use strict'

app.controller('GroupCtrl', function ( $scope, $http, $location ) {

  $scope.goToNewGroup = () => {
    $location.path('/groups/new')
  }

  $scope.createGroup = () => {
    const newGroup = {
      name: $scope.name,
      description: $scope.description
    }

    $http.post('/api/groups', newGroup)
      .then( group => {
        console.log('group: ', group)
      })
  }

  $scope.acceptGroup = groupId => {
    $http.post(`/api/groups/accept/${groupId}`)
      .then( group => $route.reload())
  }

  $scope.rejectGroup = groupId => {
    $http.post(`/api/groups/reject/${groupId}`)
      .then( group => $route.reload())
  }

  $scope.goToGroupPage = id => $location.path(`/groups/${id}`)

  $http.get('/api/groups')
    .then( groups => {
      $scope.groups = groups.data.groups
      $scope.invitedGroups = groups.data.invitedGroups
    })

})