'use strict'

app.controller('TaskCtrl', function ( $scope, $location, $http ) {

  $scope.goToNewTask = () => {
    $location.path('/tasks/new')
  }

  $scope.goToTask = taskId => {
    $location.path(`/tasks/${taskId}`)
  }

  $scope.completeTask = taskId => {
    $http.put(`/api/tasks/complete/${taskId}`)
      .then( task => {
        console.log('task', task)
      })
  }

  $http.get('/api/tasks')
    .then( tasks => { 
      $scope.completeTasks = tasks.data.completeTasks
      $scope.incompleteTasks = tasks.data.incompleteTasks
    }) 

})