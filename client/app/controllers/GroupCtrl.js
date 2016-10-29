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

  $scope.goToGroupPage = id => {
    $location.path(`/groups/${id}`)
  }

  $http.get('/api/groups')
    .then( groups => {
      console.log('user groups: ', groups)
      $scope.groups = groups.data
    })

})