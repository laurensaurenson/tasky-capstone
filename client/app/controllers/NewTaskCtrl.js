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

    console.log('task: ', newTask)

    $http.post('/api/tasks', newTask)
      .then(task => {
        console.log('posted task: ', task)
        $location.path('/tasks')
      })

  }

})