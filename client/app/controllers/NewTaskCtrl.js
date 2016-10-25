'use strict'

app.controller('NewTaskCtrl', function ( $scope, $http, $location ) {

  $scope.addTask = () => {
    const newTask = {
      taskName: $scope.name,
      repeatableTime: $scope.repeat,
      type: $scope.type,
      difficulty: $scope.difficulty, 
      notes: $scope.notes
    }

    $http.post('/api/tasks', newTask)
      .then(task => $location.path('/tasks'))

  }

})