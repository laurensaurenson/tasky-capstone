'use strict'

app.controller('NewTaskCtrl', function ( $scope, $http, $location, $route ) {

  $scope.addTask = () => {
    $http.post('/api/tasks', $scope.newTask)
      .then(task => $location.path('/tasks'))
  }

  // $scope.goToCreateCollection = () => $location.path('/collections/new')

  $scope.showCreateCollection = () => {
    if ( $scope.createCollection ) {
      $scope.createCollection = false
    } else {
      $scope.createCollection = true
    }
  }

  $scope.submitCollection = () => {
    $http.post('/api/collections', $scope.collection)
      .then( collection => {
        $scope.groups.push(collection.data)
        $scope.createCollection = false
    })
  }

  $http.get('/api/collections')
    .then( groups => $scope.groups = groups.data)

})