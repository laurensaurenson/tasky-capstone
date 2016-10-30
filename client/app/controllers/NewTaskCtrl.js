'use strict'

app.controller('NewTaskCtrl', function ( $scope, $http, $location ) {

  $scope.addTask = () => {
    $http.post('/api/tasks', $scope.newTask)
      .then(task => $location.path('/tasks'))
  }

  $scope.goToCreateCollection = () => $location.path('/collections/new')

  $http.get('/api/collections')
    .then( groups => $scope.groups = groups.data)

})