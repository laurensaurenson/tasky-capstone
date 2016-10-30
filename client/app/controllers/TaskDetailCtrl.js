'use strict'

app.controller('TaskDetailCtrl', function ( $scope, $location, $http, $routeParams ) {

  $http.get(`/api/tasks/${$routeParams.taskId}`)
    .then( task => {
      $scope.task = task.data
      console.log('scope.task', $scope.task)
    })

  $scope.editTask = taskId => {
    $location.path(`/tasks/edit/${taskId}`)
  }

  $scope.deleteTask = taskId => {
    $http.post(`/api/tasks/delete/${taskId}`)
      .then( task => {
        console.log('task', task)
      })
  }

  $scope.completeTask = taskId => {
    $http.put(`/api/tasks/complete/${taskId}`)
      .then( task => {
        console.log('task', task)
      })
  }

})